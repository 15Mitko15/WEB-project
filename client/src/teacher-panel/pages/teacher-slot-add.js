import { createAsyncAction } from "../../hooks/async.js";
import { eventsService } from "../../services/events-service.js";
import { Button } from "../../components/button.js";
import { Input } from "../../components/input.js";
import { Card } from "../../components/card.js";
import { showMessage } from "../../utils/show-message.js";
import { setLoading } from "../../utils/set-loading.js";
import { slotService } from "../../services/slot-service.js";

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

function setSelectPlaceholder(selectEl, text, disabled = true) {
  selectEl.innerHTML = "";
  const opt = document.createElement("option");
  opt.value = "";
  opt.textContent = text;
  selectEl.appendChild(opt);
  selectEl.disabled = disabled;
}

function escapeText(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function timeToMinutes(hhmm) {
  const [h, m] = String(hhmm || "")
    .split(":")
    .map((x) => parseInt(x, 10));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return NaN;
  return h * 60 + m;
}

export function renderTeacherSlotAddPage(rootEl) {
  rootEl.innerHTML = `<div class="container"><div id="slot" class="stack"></div></div>`;
  const slot = rootEl.querySelector("#slot");

  // --- Date ---
  const { element: dateField, input: dateInput } = Input({
    label: "Date",
    name: "slot_date",
    type: "date",
  });
  dateInput.classList?.add("input--lg");
  // Prevent selecting past dates in UI (backend should still validate)
  dateInput.min = new Date().toISOString().slice(0, 10);

  // --- Faculty dropdown ---
  const { field: facultyField, select: facultySelect } = makeSelectField({
    labelText: "Faculty",
    id: "slot-faculty",
    disabled: true,
  });

  // --- Hall dropdown ---
  const { field: hallField, select: hallSelect } = makeSelectField({
    labelText: "Hall",
    id: "slot-hall",
    disabled: true,
  });

  // --- Time ---
  const { element: startField, input: startInput } = Input({
    label: "Start time",
    name: "start_time",
    type: "time",
  });
  startInput.classList?.add("input--lg");

  const { element: endField, input: endInput } = Input({
    label: "End time",
    name: "end_time",
    type: "time",
  });
  endInput.classList?.add("input--lg");

  // --- Duration ---
  const { element: durField, input: durInput } = Input({
    label: "Event duration (minutes)",
    name: "duration_minutes",
    type: "number",
  });
  durInput.classList?.add("input--lg");
  durInput.min = "1";
  durInput.step = "1";
  durInput.value = "30"; // sensible default

  const message = document.createElement("div");
  message.className = "message message--error";
  message.style.display = "none";

  const form = document.createElement("form");
  form.className = "stack";
  form.append(
    dateField,
    facultyField,
    hallField,
    startField,
    endField,
    durField
  );

  const actions = document.createElement("div");
  actions.className = "row";

  const submitBtn = Button({
    label: "Save slot",
    variant: "primary",
    type: "submit",
  });

  const cancelLink = document.createElement("a");
  cancelLink.href = "#/teacher/home";
  cancelLink.textContent = "Cancel";
  cancelLink.style.color = "var(--muted)";

  actions.append(submitBtn, cancelLink);
  form.append(actions);

  const card = Card({
    title: "Add a Slot",
    body: form,
  });

  slot.append(card, message);

  // --- Local state ---
  let faculties = [];
  let halls = [];

  function renderFacultyOptions(list) {
    facultySelect.innerHTML = "";
    const ph = document.createElement("option");
    ph.value = "";
    ph.textContent = "Select faculty…";
    facultySelect.appendChild(ph);

    for (const f of list) {
      const id = Number(f?.id ?? 0);
      if (!id) continue;
      const opt = document.createElement("option");
      opt.value = String(id);
      opt.textContent = String(f.name ?? `Faculty #${id}`);
      facultySelect.appendChild(opt);
    }

    facultySelect.disabled = false;
  }

  function renderHallOptions(list) {
    hallSelect.innerHTML = "";
    const ph = document.createElement("option");
    ph.value = "";
    ph.textContent = "Select hall…";
    hallSelect.appendChild(ph);

    for (const h of list) {
      const id = Number(h?.id ?? h?.hall_id ?? 0);
      if (!id) continue;

      const hallNum = h?.hall_number ?? "";
      const cap = h?.capacity ? ` (cap: ${h.capacity})` : "";

      const opt = document.createElement("option");
      opt.value = String(id);
      opt.textContent = `Hall ${escapeText(hallNum)}${cap}`.trim();
      hallSelect.appendChild(opt);
    }

    hallSelect.disabled = false;
  }

  // --- Async actions ---
  const loadFacultiesAction = createAsyncAction(async () => {
    return await eventsService.listFaculties();
  });

  const loadHallsByFacultyAction = createAsyncAction(async (facultyId) => {
    return await eventsService.listHallsByFaculty(facultyId);
  });

  const createSlotAction = createAsyncAction(async (payload) => {
    // requires eventsService.createSlot()
    return await slotService.createSlot(payload);
  });

  // --- Subscriptions ---
  const unsubFaculties = loadFacultiesAction.subscribe((s) => {
    if (s.status === "idle") return;

    if (s.status === "loading") {
      setSelectPlaceholder(facultySelect, "Loading faculties…", true);
      setSelectPlaceholder(hallSelect, "Select faculty first…", true);
      return;
    }

    if (s.status === "error") {
      setSelectPlaceholder(facultySelect, "Failed to load faculties", true);
      setSelectPlaceholder(hallSelect, "Select faculty first…", true);
      showMessage(message, s.error?.message || "Failed to load faculties.");
      return;
    }

    if (s.status === "success") {
      faculties = Array.isArray(s.data) ? s.data : [];
      if (!faculties.length) {
        setSelectPlaceholder(facultySelect, "No faculties found", true);
        setSelectPlaceholder(hallSelect, "Select faculty first…", true);
        return;
      }
      renderFacultyOptions(faculties);
      setSelectPlaceholder(hallSelect, "Select faculty first…", true);
    }
  });

  const unsubHalls = loadHallsByFacultyAction.subscribe((s) => {
    if (s.status === "idle") return;

    if (s.status === "loading") {
      setSelectPlaceholder(hallSelect, "Loading halls…", true);
      return;
    }

    if (s.status === "error") {
      setSelectPlaceholder(hallSelect, "Failed to load halls", true);
      showMessage(message, s.error?.message || "Failed to load halls.");
      return;
    }

    if (s.status === "success") {
      halls = Array.isArray(s.data) ? s.data : [];
      if (!halls.length) {
        setSelectPlaceholder(hallSelect, "No halls found", true);
        return;
      }
      renderHallOptions(halls);
    }
  });

  const unsubCreate = createSlotAction.subscribe((s) => {
    if (s.status === "loading") {
      setLoading(submitBtn, true, "Saving…");
      showMessage(message, "Saving slot…", { muted: true });
      return;
    }

    if (s.status === "error") {
      setLoading(submitBtn, false);
      showMessage(message, s.error?.message || "Failed to save slot.");
      return;
    }

    if (s.status === "success") {
      setLoading(submitBtn, false);
      window.location.hash = "#/teacher/home";
      return;
    }

    setLoading(submitBtn, false);
  });

  // --- Handlers ---
  function onFacultyChange() {
    const facultyId = Number(facultySelect.value || 0);
    halls = [];

    if (!facultyId) {
      setSelectPlaceholder(hallSelect, "Select faculty first…", true);
      return;
    }

    setSelectPlaceholder(hallSelect, "Loading halls…", true);
    loadHallsByFacultyAction.run(facultyId);
  }

  async function onSubmit(e) {
    e.preventDefault();

    const slot_date = String(dateInput.value || "").trim();
    const hall_id = Number(hallSelect.value || 0);
    const start_time = String(startInput.value || "").trim(); // "HH:MM"
    const end_time = String(endInput.value || "").trim(); // "HH:MM"
    const duration_minutes = Number(durInput.value || 0);

    const missing = [];
    if (!slot_date) missing.push("date");
    if (!hall_id) missing.push("hall");
    if (!start_time) missing.push("start time");
    if (!end_time) missing.push("end time");
    if (!duration_minutes) missing.push("duration");

    if (missing.length) {
      showMessage(message, `Please enter ${missing.join(", ")}.`);
      return;
    }

    const startMin = timeToMinutes(start_time);
    const endMin = timeToMinutes(end_time);
    const available = endMin - startMin;

    if (!Number.isFinite(available) || available <= 0) {
      showMessage(message, "End time must be after start time.");
      return;
    }

    if (!Number.isFinite(duration_minutes) || duration_minutes <= 0) {
      showMessage(message, "Duration must be a positive number.");
      return;
    }

    if (duration_minutes > available) {
      showMessage(
        message,
        `Duration cannot be greater than the available window (${available} minutes).`
      );
      return;
    }

    // clear message
    showMessage(message, "", { muted: true });
    message.style.display = "none";

    await createSlotAction.run({
      slot_date, // match backend
      hall_id,
      start_time, // backend can normalize HH:MM -> HH:MM:SS
      end_time,
      duration_minutes,
    });
  }

  // --- Listeners ---
  form.addEventListener("submit", onSubmit);
  facultySelect.addEventListener("change", onFacultyChange);

  // --- Initial load ---
  setSelectPlaceholder(facultySelect, "Loading faculties…", true);
  setSelectPlaceholder(hallSelect, "Select faculty first…", true);
  loadFacultiesAction.run();

  return () => {
    unsubFaculties();
    unsubHalls();
    unsubCreate();

    form.removeEventListener("submit", onSubmit);
    facultySelect.removeEventListener("change", onFacultyChange);
  };
}
