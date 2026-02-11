import { createAsyncAction } from "../../hooks/async.js";
import { eventsService } from "../../services/events-service.js";
import { Button } from "../../components/button.js";
import { Input } from "../../components/input.js";
import { Card } from "../../components/card.js";
import { showMessage } from "../../utils/show-message.js";
import { setLoading } from "../../utils/set-loading.js";

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

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function parseSlotStartMs(slot) {
  // slot_date: "YYYY-MM-DD", start_time: "HH:MM:SS"
  // Use local time reliably:
  const d = String(slot?.slot_date ?? "");
  const t = String(slot?.start_time ?? "00:00:00").slice(0, 8);
  const ms = new Date(`${d}T${t}`).getTime();
  return Number.isFinite(ms) ? ms : Number.NaN;
}

function compareString(a, b) {
  return String(a ?? "").localeCompare(String(b ?? ""), undefined, {
    sensitivity: "base",
  });
}

export function renderTeacherSlotsViewPage(rootEl) {
  rootEl.innerHTML = `<div class="container"><div id="slotsView" class="stack"></div></div>`;
  const host = rootEl.querySelector("#slotsView");

  // ---------- Controls ----------
  const header = document.createElement("div");
  header.className = "home-header"; // reuse your styles if you want

  const title = document.createElement("div");
  title.innerHTML = `
    <h1 class="slots-title">All Slots</h1>
    <p class="slots-subtitle">
      View slots from today forward. Use the date range to show older slots too.
    </p>
  `;

  const controls = document.createElement("div");
  controls.className = "controls";

  // Sort
  const { field: sortField, select: sortSelect } = makeSelectField({
    labelText: "Sort",
    id: "slots-sort",
    disabled: false,
  });
  sortSelect.innerHTML = `
    <option value="date_asc" selected>Date (oldest → newest)</option>
    <option value="date_desc">Date (newest → oldest)</option>
    <option value="faculty_asc">Faculty (A → Z)</option>
    <option value="faculty_desc">Faculty (Z → A)</option>
    <option value="hall_asc">Hall (ascending)</option>
    <option value="hall_desc">Hall (descending)</option>
  `;

  // Faculty filter
  const { field: facultyField, select: facultySelect } = makeSelectField({
    labelText: "Faculty",
    id: "slots-faculty",
    disabled: true,
  });
  setSelectPlaceholder(facultySelect, "Loading faculties…", true);

  // Date range
  const { element: startDateField, input: startDateInput } = Input({
    label: "From date",
    name: "start_date",
    type: "date",
  });

  startDateInput.classList?.add("input--lg");

  const { element: endDateField, input: endDateInput } = Input({
    label: "To date",
    name: "end_date",
    type: "date",
  });

  endDateInput.classList?.add("input--lg");

  // Include past checkbox (toggles re-fetch)
  const includeWrap = document.createElement("div");
  includeWrap.className = "field";
  const includeLabel = document.createElement("label");
  includeLabel.textContent = "Include past slots";
  includeLabel.setAttribute("for", "slots-include-past");
  const includePast = document.createElement("input");
  includePast.type = "checkbox";
  includePast.id = "slots-include-past";
  includePast.style.transform = "scale(1.2)";
  includePast.style.marginTop = "10px";
  includeWrap.append(includeLabel, includePast);

  // Reset
  const resetBtn = Button({
    label: "Reset",
    variant: "ghost",
    type: "button",
  });

  controls.append(
    sortField,
    facultyField,
    startDateField,
    endDateField,
    includeWrap,
    resetBtn
  );
  header.append(title, controls);

  // ---------- List ----------
  const message = document.createElement("div");
  message.className = "message message--error";
  message.style.display = "none";

  const list = document.createElement("div");
  list.className = "stack";

  const card = Card({
    title: "Slots",
    body: list,
  });

  host.append(header, card, message);

  // ---------- State ----------
  let slots = []; // raw slots from backend
  let faculties = [];
  let hallsById = new Map(); // hall_id -> { id, hall_number, faculty_id, capacity }
  let facultyById = new Map(); // faculty_id -> { id, name }
  let hallIdsByFacultyId = new Map(); // faculty_id -> Set(hall_id)

  const PAGE_SIZE = 20;
  let currentPage = 1;

  // Pagination (simple)
  const pagination = document.createElement("nav");
  pagination.className = "pagination";
  pagination.style.display = "none";
  pagination.innerHTML = `
    <button class="page-btn" data-page="prev" type="button">Prev</button>
    <div class="page-numbers"></div>
    <button class="page-btn" data-page="next" type="button">Next</button>
  `;
  host.append(pagination);
  const pageNumbers = pagination.querySelector(".page-numbers");

  function renderFacultyOptions() {
    facultySelect.innerHTML = "";
    const all = document.createElement("option");
    all.value = "all";
    all.textContent = "All faculties";
    facultySelect.appendChild(all);

    for (const f of faculties) {
      const opt = document.createElement("option");
      opt.value = String(f.id);
      opt.textContent = String(f.name ?? `Faculty #${f.id}`);
      facultySelect.appendChild(opt);
    }

    facultySelect.disabled = false;
  }

  function slotViewModel(s) {
    const hall = hallsById.get(Number(s.hall_id)) || null;
    const faculty = hall ? facultyById.get(Number(hall.faculty_id)) : null;

    return {
      ...s,
      _ms: parseSlotStartMs(s),
      _hall_number: hall?.hall_number ?? null,
      _capacity: hall?.capacity ?? null,
      _faculty_id: hall?.faculty_id ?? null,
      _faculty_name: faculty?.name ?? "",
    };
  }

  function getFilters() {
    const facultyIdRaw = String(facultySelect.value || "all");
    const facultyId = facultyIdRaw === "all" ? null : Number(facultyIdRaw);
    const start = String(startDateInput.value || "").trim();
    const end = String(endDateInput.value || "").trim();
    const sort = String(sortSelect.value || "date_asc");
    return { facultyId, start, end, sort };
  }

  function inDateRange(slotDate, start, end) {
    // slotDate and start/end are "YYYY-MM-DD". Lexicographic compare works.
    if (start && slotDate < start) return false;
    if (end && slotDate > end) return false;
    return true;
  }

  function getFilteredSortedItems() {
    const { facultyId, start, end, sort } = getFilters();

    let items = slots.map(slotViewModel);

    // Default view: from today forward (even if we loaded include_past=1)
    // If teacher hasn't set any start/end and includePast unchecked, enforce today+.
    if (!includePast.checked && !start && !end) {
      const t = todayISO();
      items = items.filter((x) => String(x.slot_date ?? "") >= t);
    }

    // Faculty filter
    if (facultyId != null && facultyId > 0) {
      const hallSet = hallIdsByFacultyId.get(facultyId);
      items = items.filter((x) => hallSet?.has(Number(x.hall_id)));
    }

    // Date range filter
    if (start || end) {
      items = items.filter((x) =>
        inDateRange(String(x.slot_date ?? ""), start, end)
      );
    }

    // Sorting
    items.sort((a, b) => {
      if (sort === "date_desc") return (b._ms ?? 0) - (a._ms ?? 0);
      if (sort === "date_asc") return (a._ms ?? 0) - (b._ms ?? 0);

      if (sort === "faculty_asc") {
        const c = compareString(a._faculty_name, b._faculty_name);
        return c !== 0 ? c : (a._ms ?? 0) - (b._ms ?? 0);
      }
      if (sort === "faculty_desc") {
        const c = compareString(b._faculty_name, a._faculty_name);
        return c !== 0 ? c : (a._ms ?? 0) - (b._ms ?? 0);
      }

      if (sort === "hall_asc") {
        const c = Number(a._hall_number ?? 0) - Number(b._hall_number ?? 0);
        return c !== 0 ? c : (a._ms ?? 0) - (b._ms ?? 0);
      }
      if (sort === "hall_desc") {
        const c = Number(b._hall_number ?? 0) - Number(a._hall_number ?? 0);
        return c !== 0 ? c : (a._ms ?? 0) - (b._ms ?? 0);
      }

      return (a._ms ?? 0) - (b._ms ?? 0);
    });

    return items;
  }

  function getTotalPages(count) {
    return Math.max(1, Math.ceil(count / PAGE_SIZE));
  }

  function clampPage(page, totalPages) {
    return Math.min(Math.max(1, page), totalPages);
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      pagination.style.display = "none";
      return;
    }
    pagination.style.display = "flex";
    pageNumbers.innerHTML = "";

    const makeBtn = (p) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "page-number";
      b.dataset.page = String(p);
      b.textContent = String(p);
      if (p === currentPage) b.classList.add("active");
      return b;
    };

    const prevBtn = pagination.querySelector('[data-page="prev"]');
    const nextBtn = pagination.querySelector('[data-page="next"]');
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    // show small window
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    if (start > 1) pageNumbers.appendChild(makeBtn(1));
    if (start > 2) {
      const e = document.createElement("span");
      e.textContent = "…";
      e.className = "page-ellipsis";
      pageNumbers.appendChild(e);
    }

    for (let p = start; p <= end; p++) pageNumbers.appendChild(makeBtn(p));

    if (end < totalPages - 1) {
      const e = document.createElement("span");
      e.textContent = "…";
      e.className = "page-ellipsis";
      pageNumbers.appendChild(e);
    }
    if (end < totalPages) pageNumbers.appendChild(makeBtn(totalPages));
  }

  function renderList() {
    const items = getFilteredSortedItems();
    const totalPages = getTotalPages(items.length);
    currentPage = clampPage(currentPage, totalPages);

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = items.slice(start, start + PAGE_SIZE);

    list.innerHTML = "";

    if (!pageItems.length) {
      list.innerHTML = `<p class="empty-state">No slots match your filters.</p>`;
      renderPagination(1);
      return;
    }

    for (const s of pageItems) {
      const hallTxt =
        s._hall_number != null
          ? `Hall ${escapeHtml(s._hall_number)}`
          : "Hall ?";
      const facultyTxt = s._faculty_name
        ? escapeHtml(s._faculty_name)
        : "Unknown faculty";
      const capTxt = s._capacity ? ` • cap: ${escapeHtml(s._capacity)}` : "";

      const row = document.createElement("article");
      row.className = "event-row"; // reuse your event-row styling

      row.innerHTML = `
        <div class="event-date" aria-label="Slot date">
          <div class="event-month">${escapeHtml(
            String(s.slot_date ?? "")
          )}</div>
          <div class="event-day">${escapeHtml(
            String(s.start_time ?? "").slice(0, 5)
          )}</div>
          <div class="event-time">→ ${escapeHtml(
            String(s.end_time ?? "").slice(0, 5)
          )}</div>
        </div>

        <div class="event-content">
          <div class="event-main">
            <div class="event-text">
              <div class="event-heading">
                <h2 class="event-title">${facultyTxt}</h2>
                <span class="event-author">${hallTxt}${capTxt}</span>
              </div>
              <p class="event-desc">Duration: ${escapeHtml(
                String(s.duration_minutes ?? "")
              )} min</p>
            </div>
          </div>
        </div>
      `;

      list.appendChild(row);
    }

    renderPagination(totalPages);
  }

  // ---------- Loading ----------
  const loadAction = createAsyncAction(async ({ include_past }) => {
    // Load faculties and halls map for faculty filter + labels.
    const facs = await eventsService.listFaculties();

    // Build hall maps. We’ll fetch halls per faculty (simple, ok for small data)
    const hallLists = await Promise.all(
      (facs ?? []).map((f) => eventsService.listHallsByFaculty(f.id))
    );
    const allHalls = hallLists.flat();

    const slotsList = await eventsService.listSlotsAll({ include_past });

    return { facs, halls: allHalls, slots: slotsList };
  });

  const unsubLoad = loadAction.subscribe((s) => {
    if (s.status === "idle") return;

    if (s.status === "loading") {
      showMessage(message, "Loading slots…", { muted: true });
      setLoading(resetBtn, true, "Loading…");
      facultySelect.disabled = true;
      return;
    }

    if (s.status === "error") {
      setLoading(resetBtn, false);
      showMessage(message, s.error?.message || "Failed to load slots.");
      facultySelect.disabled = true;
      return;
    }

    if (s.status === "success") {
      setLoading(resetBtn, false);
      message.style.display = "none";

      faculties = Array.isArray(s.data.facs) ? s.data.facs : [];
      const halls = Array.isArray(s.data.halls) ? s.data.halls : [];
      slots = Array.isArray(s.data.slots) ? s.data.slots : [];

      // Maps
      facultyById = new Map(faculties.map((f) => [Number(f.id), f]));

      hallsById = new Map();
      hallIdsByFacultyId = new Map();

      for (const h of halls) {
        const id = Number(h?.id ?? h?.hall_id ?? 0);
        if (!id) continue;
        hallsById.set(id, h);

        const fid = Number(h.faculty_id ?? 0);
        if (!hallIdsByFacultyId.has(fid))
          hallIdsByFacultyId.set(fid, new Set());
        hallIdsByFacultyId.get(fid).add(id);
      }

      renderFacultyOptions();
      currentPage = 1;
      renderList();
    }
  });

  // ---------- Handlers ----------
  function onControlsChange() {
    currentPage = 1;
    renderList();
  }

  function onPaginationClick(e) {
    const btn = e.target.closest("button");
    if (!btn) return;

    const items = getFilteredSortedItems();
    const totalPages = getTotalPages(items.length);

    const page = btn.dataset.page;
    if (page === "prev") currentPage -= 1;
    else if (page === "next") currentPage += 1;
    else currentPage = Number(page);

    currentPage = clampPage(currentPage, totalPages);
    renderList();
  }

  function onReset() {
    sortSelect.value = "date_asc";
    facultySelect.value = "all";
    startDateInput.value = "";
    endDateInput.value = "";
    includePast.checked = false;
    currentPage = 1;

    // Reload future-only list (smaller)
    loadAction.run({ include_past: 0 });
  }

  function onIncludePastToggle() {
    // If checked, reload with include_past=1 (to allow old browsing)
    loadAction.run({ include_past: includePast.checked ? 1 : 0 });
  }

  // Auto-enable includePast if teacher selects an older start date
  function onStartDateChange() {
    const start = String(startDateInput.value || "");
    if (start && start < todayISO() && !includePast.checked) {
      includePast.checked = true;
      loadAction.run({ include_past: 1 });
    }
    onControlsChange();
  }

  sortSelect.addEventListener("change", onControlsChange);
  facultySelect.addEventListener("change", onControlsChange);
  endDateInput.addEventListener("change", onControlsChange);
  startDateInput.addEventListener("change", onStartDateChange);
  includePast.addEventListener("change", onIncludePastToggle);
  resetBtn.addEventListener("click", onReset);
  pagination.addEventListener("click", onPaginationClick);

  // ---------- Initial load ----------
  loadAction.run({ include_past: 0 });

  return () => {
    unsubLoad();

    sortSelect.removeEventListener("change", onControlsChange);
    facultySelect.removeEventListener("change", onControlsChange);
    endDateInput.removeEventListener("change", onControlsChange);
    startDateInput.removeEventListener("change", onStartDateChange);
    includePast.removeEventListener("change", onIncludePastToggle);
    resetBtn.removeEventListener("click", onReset);
    pagination.removeEventListener("click", onPaginationClick);
  };
}
