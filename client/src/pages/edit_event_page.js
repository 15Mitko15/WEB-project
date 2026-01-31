import { createAsyncAction } from "../hooks/async.js";
import { eventsService } from "../services/events-service.js";
import { Button } from "../components/button.js";
import { Input } from "../components/input.js";
import { Card } from "../components/card.js";
import { showMessage } from "../utils/show-message.js";
import { setLoading } from "../utils/set-loading.js";

function makeSelectField({ labelText, id, disabled = false }) {
  const field = document.createElement("div");
  field.className = "field";

  const label = document.createElement("label");
  label.textContent = labelText;
  label.setAttribute("for", id);

  const select = document.createElement("select");
  select.className = "input input--lg";
  select.id = id;
  select.disabled = disabled;

  field.append(label, select);
  return { field, select };
}

function setSelectPlaceholder(selectEl, text) {
  selectEl.innerHTML = "";
  const opt = document.createElement("option");
  opt.value = "";
  opt.textContent = text;
  selectEl.appendChild(opt);
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function timeToMinutes(hhmmss) {
  const [h, m] = String(hhmmss || "")
    .split(":")
    .map((x) => parseInt(x, 10));
  return h * 60 + m;
}

function minutesToTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${pad2(h)}:${pad2(m)}:00`;
}

function extractDateFromDatetime(datetimeStr) {
  const s = String(datetimeStr || "");
  if (!s) return "";
  return s.includes("T") ? s.split("T")[0] : s.split(" ")[0];
}

function extractTimeFromDatetime(datetimeStr) {
  // supports "YYYY-MM-DD HH:MM:SS" or ISO
  // returns "HH:MM:SS"
  const s = String(datetimeStr || "");
  const timePart = s.includes("T") ? s.split("T")[1] : s.split(" ")[1];
  return (timePart || "").slice(0, 8);
}

function buildTimeDropdown(timeSelect, slots, busyTimesSet) {
  timeSelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select time…";
  timeSelect.appendChild(placeholder);

  for (const slot of slots) {
    const start = slot.start_time; // "HH:MM:SS"
    const end = slot.end_time; // "HH:MM:SS"
    const step = Number(slot.duration_minutes || 0);

    const group = document.createElement("optgroup");
    group.label = `${start.slice(0, 5)} – ${end.slice(0, 5)}`;

    if (!step || step <= 0) continue;

    let t = timeToMinutes(start);
    const endMin = timeToMinutes(end);

    while (t < endMin) {
      const timeStr = minutesToTime(t); // "HH:MM:00"
      const opt = document.createElement("option");
      opt.value = timeStr;

      const label = timeStr.slice(0, 5);
      opt.textContent = label;

      if (busyTimesSet.has(timeStr)) {
        opt.disabled = true;
        opt.textContent = `${label} (taken)`;
      }

      group.appendChild(opt);
      t += step;
    }

    timeSelect.appendChild(group);
  }
}

export function renderEventEditPage(rootEl, eventId) {
  rootEl.innerHTML = `<div class="container"><div id="slot" class="stack"></div></div>`;
  const slot = rootEl.querySelector("#slot");

  // --- Date / Hall / Time selects ---
  const { field: dateField, select: dateSelect } = makeSelectField({
    labelText: "Date",
    id: "event-date",
    disabled: true,
  });

  const { field: hallField, select: hallSelect } = makeSelectField({
    labelText: "Hall",
    id: "event-hall",
    disabled: true,
  });

  const { field: timeField, select: timeSelect } = makeSelectField({
    labelText: "Time",
    id: "event-time",
    disabled: true,
  });

  // Title
  const { element: titleField, input: titleInput } = Input({
    label: "Title",
    name: "title",
    type: "text",
  });
  titleInput.classList?.add("input--lg");

  // Description (textarea)
  const descField = document.createElement("div");
  descField.className = "field";
  const descLabel = document.createElement("label");
  descLabel.textContent = "Description";
  descLabel.setAttribute("for", "description");

  const descInput = document.createElement("textarea");
  descInput.id = "description";
  descInput.name = "description";
  descInput.rows = 7;
  descInput.className = "input input--lg textarea";
  descField.append(descLabel, descInput);

  const message = document.createElement("div");
  message.className = "message message--error";
  message.style.display = "none";

  const form = document.createElement("form");
  form.className = "stack";
  form.append(dateField, hallField, timeField, titleField, descField);

  const actions = document.createElement("div");
  actions.className = "row";

  const submitBtn = Button({
    label: "Save changes",
    variant: "primary",
    type: "submit",
  });

  const cancelLink = document.createElement("a");
  cancelLink.href = `#/event/${encodeURIComponent(String(eventId))}`;
  cancelLink.textContent = "Cancel";
  cancelLink.style.color = "var(--muted)";

  actions.append(submitBtn, cancelLink);
  form.append(actions);

  const card = Card({
    title: "Edit Event",
    body: form,
  });

  slot.append(card, message);

  // ---- Local state ----
  let currentEvent = null;

  let hallsForDate = []; // [{ hall_id, hall_number, faculty_name }]
  let slotsForHallDate = []; // slots
  let busyTimesSet = new Set(); // "HH:MM:SS"

  // Prepopulation target
  let desiredDate = "";
  let desiredHallId = 0;
  let desiredTime = "";

  // ---- Async actions ----
  const loadEventAction = createAsyncAction(async (id) => {
    return await eventsService.getEvent(id);
  });

  // includePast: allows editing older events
  const loadDatesAction = createAsyncAction(async () => {
    return await eventsService.listSlotDates({ includePast: true });
  });

  const loadHallsAction = createAsyncAction(async (date) => {
    return await eventsService.listSlotHallsByDate(date, { includePast: true });
  });

  const loadTimesAction = createAsyncAction(async ({ date, hallId }) => {
    const slots = await eventsService.listSlotsByDateAndHall(date, hallId);

    // Load events for each slot and build a set of occupied start-times
    const eventLists = await Promise.all(
      slots.map((s) => eventsService.listEventsForSlot(s.id))
    );

    const busy = new Set();
    for (const events of eventLists) {
      for (const ev of events) {
        const t = extractTimeFromDatetime(ev.datetime);
        if (t) busy.add(t);
      }
    }

    // IMPORTANT: allow the currently-edited event time to remain selectable
    if (desiredTime) busy.delete(desiredTime);

    return { slots, busy };
  });

  const updateAction = createAsyncAction(async ({ id, patch }) => {
    return await eventsService.updateEvent(id, patch);
  });

  // ---- Subscriptions ----
  const unsubEvent = loadEventAction.subscribe((s) => {
    if (s.status === "loading") {
      message.style.display = "none";
      return;
    }
    if (s.status === "error") {
      showMessage(message, s.error?.message || "Failed to load event.");
      return;
    }
    if (s.status === "success") {
      currentEvent = s.data;

      if (!currentEvent) {
        showMessage(message, "Event not found.");
        return;
      }

      console.log("CURRENT EVENT", currentEvent);

      // Prepopulate text fields immediately
      titleInput.value = currentEvent.title ?? "";
      descInput.value =
        currentEvent.event_description ?? currentEvent.description ?? "";

      // Determine desired selects
      const dt = currentEvent.datetime ?? currentEvent.event_datetime ?? "";
      desiredDate = extractDateFromDatetime(dt) || "";
      desiredTime = extractTimeFromDatetime(dt) || "";
      desiredHallId = Number(currentEvent.hall_id ?? currentEvent.hallId ?? 0);

      // Start loading selectable data (dates)
      dateSelect.disabled = true;
      setSelectPlaceholder(dateSelect, "Loading dates…");
      loadDatesAction.run();
    }
  });

  const unsubDates = loadDatesAction.subscribe((s) => {
    if (s.status === "loading") {
      dateSelect.disabled = true;
      setSelectPlaceholder(dateSelect, "Loading dates…");
      return;
    }
    if (s.status === "error") {
      dateSelect.disabled = true;
      setSelectPlaceholder(dateSelect, "Failed to load dates");
      showMessage(message, s.error?.message || "Failed to load slot dates.");
      return;
    }
    if (s.status === "success") {
      const dates = Array.isArray(s.data) ? s.data : [];

      dateSelect.disabled = false;
      dateSelect.innerHTML = "";

      const ph = document.createElement("option");
      ph.value = "";
      ph.textContent = "Select date…";
      dateSelect.appendChild(ph);

      // Ensure the event’s date is present even if it’s missing from slots (rare)
      const dateSet = new Set(dates);
      if (desiredDate && !dateSet.has(desiredDate)) {
        dates.unshift(desiredDate);
      }

      for (const d of dates) {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        dateSelect.appendChild(opt);
      }

      // Preselect event date and load halls
      if (desiredDate) {
        dateSelect.value = desiredDate;
        loadHallsAction.run(desiredDate);
      }

      // Reset dependents
      hallSelect.disabled = true;
      setSelectPlaceholder(hallSelect, "Select date first…");

      timeSelect.disabled = true;
      setSelectPlaceholder(timeSelect, "Select hall first…");
    }
  });

  const unsubHalls = loadHallsAction.subscribe((s) => {
    if (s.status === "loading") {
      hallSelect.disabled = true;
      setSelectPlaceholder(hallSelect, "Loading halls…");
      return;
    }
    if (s.status === "error") {
      hallSelect.disabled = true;
      setSelectPlaceholder(hallSelect, "Failed to load halls");
      showMessage(
        message,
        s.error?.message || "Failed to load halls for date."
      );
      return;
    }
    if (s.status === "success") {
      hallsForDate = Array.isArray(s.data) ? s.data : [];

      hallSelect.disabled = false;
      hallSelect.innerHTML = "";

      const ph = document.createElement("option");
      ph.value = "";
      ph.textContent = "Select hall…";
      hallSelect.appendChild(ph);

      for (const h of hallsForDate) {
        const opt = document.createElement("option");
        opt.value = String(h.hall_id);
        opt.textContent = `${h.faculty_name}, ${h.hall_number}`;
        hallSelect.appendChild(opt);
      }

      // Preselect event hall and load times
      if (desiredHallId) {
        hallSelect.value = String(desiredHallId);
        loadTimesAction.run({ date: desiredDate, hallId: desiredHallId });
      }

      timeSelect.disabled = true;
      setSelectPlaceholder(timeSelect, "Select hall first…");
    }
  });

  const unsubTimes = loadTimesAction.subscribe((s) => {
    if (s.status === "idle") return;

    if (s.status === "loading") {
      timeSelect.disabled = true;
      setSelectPlaceholder(timeSelect, "Loading times…");
      return;
    }

    if (s.status === "error") {
      timeSelect.disabled = true;
      setSelectPlaceholder(timeSelect, "Failed to load times");
      showMessage(message, s.error?.message || "Failed to load times.");
      return;
    }

    if (s.status === "success") {
      slotsForHallDate = s.data.slots ?? [];
      busyTimesSet = s.data.busy ?? new Set();

      if (!slotsForHallDate.length) {
        timeSelect.disabled = true;
        setSelectPlaceholder(timeSelect, "No slots available");
        return;
      }

      timeSelect.disabled = false;
      buildTimeDropdown(timeSelect, slotsForHallDate, busyTimesSet);

      // Preselect event time (ensure it exists as an option)
      if (desiredTime) {
        timeSelect.value = desiredTime;

        // If it didn't match (e.g. different seconds), try HH:MM:00 normalization
        if (!timeSelect.value && desiredTime.length >= 5) {
          const alt = desiredTime.slice(0, 5) + ":00";
          timeSelect.value = alt;
        }
      }
    }
  });

  const unsubUpdate = updateAction.subscribe((s) => {
    if (s.status === "loading") {
      setLoading(submitBtn, true, "Saving…");
      showMessage(message, "Saving changes…", { muted: true });
      return;
    }
    if (s.status === "error") {
      setLoading(submitBtn, false);
      showMessage(message, s.error?.message || "Failed to update event.");
      return;
    }
    if (s.status === "success") {
      setLoading(submitBtn, false);
      window.location.hash = `#/event/${encodeURIComponent(String(eventId))}`;
      return;
    }
    setLoading(submitBtn, false);
  });

  // ---- Handlers ----
  function onDateChange() {
    const date = String(dateSelect.value || "").trim();

    hallsForDate = [];
    hallSelect.disabled = true;
    setSelectPlaceholder(hallSelect, "Select date first…");

    timeSelect.disabled = true;
    setSelectPlaceholder(timeSelect, "Select hall first…");

    if (!date) return;

    desiredDate = date; // keep in sync
    loadHallsAction.run(date);
  }

  function onHallChange() {
    const date = String(dateSelect.value || "").trim();
    const hallId = Number(hallSelect.value || 0);

    timeSelect.disabled = true;
    setSelectPlaceholder(timeSelect, "Select hall first…");

    if (!date || !hallId) return;

    desiredHallId = hallId;
    loadTimesAction.run({ date, hallId });
  }

  async function onSubmit(e) {
    e.preventDefault();

    const date = String(dateSelect.value || "").trim();
    const hall_id = Number(hallSelect.value || 0);
    const time = String(timeSelect.value || "").trim(); // "HH:MM:SS"
    const title = String(titleInput.value || "").trim();
    const description = String(descInput.value || "").trim();

    const missing = [];
    if (!date) missing.push("date");
    if (!hall_id) missing.push("hall");
    if (!time) missing.push("time");
    if (!title) missing.push("title");
    if (!description) missing.push("description");

    if (missing.length) {
      showMessage(message, `Please enter ${missing.join(", ")}.`);
      return;
    }

    // Prevent choosing taken time (but allow the original time)
    if (busyTimesSet.has(time)) {
      showMessage(
        message,
        "That time is already taken. Please choose another."
      );
      return;
    }

    // Submit PATCH-like update
    await updateAction.run({
      id: eventId,
      patch: {
        title,
        description, // backend accepts description -> event_description
        hall_id,
        date,
        time,
      },
    });
  }

  // listeners
  dateSelect.addEventListener("change", onDateChange);
  hallSelect.addEventListener("change", onHallChange);
  form.addEventListener("submit", onSubmit);

  // initial load: fetch event, then everything else depends on it
  loadEventAction.run(eventId);

  return () => {
    unsubEvent();
    unsubDates();
    unsubHalls();
    unsubTimes();
    unsubUpdate();

    dateSelect.removeEventListener("change", onDateChange);
    hallSelect.removeEventListener("change", onHallChange);
    form.removeEventListener("submit", onSubmit);
  };
}
