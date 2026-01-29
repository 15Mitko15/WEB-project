import { createAsyncAction } from "../hooks/async.js";
import { eventsService } from "../services/events-service.js";
import { createStatusDropdown } from "../components/statusDropdown.js";

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatEventDate(isoString) {
  const d = new Date(isoString);
  const month = d.toLocaleString(undefined, { month: "short" });
  const day = d.getDate();
  const time = d.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { month, day, time };
}

function eventRowElement(event, interests) {
  const { month, day, time } = formatEventDate(event.datetime || event.date);

  const row = document.createElement("article");
  row.className = "event-row";

  row.innerHTML = `
    <div class="event-date" aria-label="Event date">
      <div class="event-month">${escapeHtml(month)}</div>
      <div class="event-day">${escapeHtml(day)}</div>
      <div class="event-time">${escapeHtml(time)}</div>
    </div>

    <div class="event-content">
      <div class="event-main">
        <div class="event-text">
          <div class="event-heading">
            <h2 class="event-title">
              <a class="event-title-link" href="#/event/${event.id}">
                ${escapeHtml(event.title)}
              </a>
            </h2>
            <span class="event-author">by ${escapeHtml(
              `${event.presenter_first_name} ${event.presenter_last_name}`.trim()
            )}</span>
          </div>
          <p class="event-desc">${escapeHtml(
            event.event_description ?? event.description ?? ""
          )}</p>
        </div>

        <div class="event-actions" data-dropdown-slot></div>
      </div>
    </div>
  `;

  const slot = row.querySelector("[data-dropdown-slot]");

  const initialId =
    event.user_interest_id ??
    interests.find((i) => i.name === event.user_interest)?.id ??
    "";

  const { wrapper, select } = createStatusDropdown({
    id: event.id,
    interests,
    initialValue: String(initialId || ""),
  });

  // IMPORTANT: event delegation will handle changes, so we tag the select
  select.dataset.eventId = String(event.id);

  slot.appendChild(wrapper);
  return row;
}

export function renderHome(container) {
  // ---------- UI shell (render once) ----------
  container.innerHTML = `
  <header class="home-header">
    <div class="home-header-top">
      <div>
        <h1 class="home-title">Upcoming Events</h1>
        <p class="home-subtitle">Browse events that are coming up soon.</p>
      </div>

      <div class="controls">
        <div class="export">
          <button id="export-csv" class="btn btn--md" type="button">Export Excel (CSV)</button>
          <button id="export-pdf" class="btn btn--md" type="button">Export PDF</button>
        </div>
        <div class="search">
          <label class="filter-label" for="title-search">Search:</label>
          <input
            id="title-search"
            class="search-input"
            type="search"
            placeholder="Search by title…"
            autocomplete="off"
          />
        </div>
        <div class="sort">
          <label class="filter-label" for="date-sort">Sort:</label>
          <select id="date-sort" class="filter-select">
            <option value="asc" selected>Oldest → Newest</option>
            <option value="desc">Newest → Oldest</option>
          </select>
        </div>
        <div class="filter">
          <label class="filter-label" for="status-filter">Filter:</label>
          <select id="status-filter" class="filter-select" disabled>
            <option value="all">All</option>
          </select>
        </div>
      </div>
    </div>
  </header>

  <section class="events-list" aria-label="List of upcoming events"></section>

  <nav class="pagination" aria-label="Pagination controls" style="display:none">
    <button class="page-btn" data-page="prev">Prev</button>
    <div class="page-numbers" aria-label="Page numbers"></div>
    <button class="page-btn" data-page="next">Next</button>
  </nav>

  <p class="empty-state" id="homeMsg">Loading events…</p>
`;

  const list = container.querySelector(".events-list");
  const exportCsvBtn = container.querySelector("#export-csv");
  const exportPdfBtn = container.querySelector("#export-pdf");
  const searchInput = container.querySelector("#title-search");
  const filterSelect = container.querySelector("#status-filter");
  const sortSelect = container.querySelector("#date-sort");
  const pagination = container.querySelector(".pagination");
  const pageNumbers = container.querySelector(".page-numbers");
  const msg = container.querySelector("#homeMsg");

  // ---------- Local state ----------
  const PAGE_SIZE = 5;
  let currentPage = 1;

  let events = [];
  let interests = [];

  function getUserInterestId(ev) {
    if (ev.user_interest_id != null) return String(ev.user_interest_id);
    const found = interests.find((i) => i.name === ev.user_interest);
    return found ? String(found.id) : "";
  }

  function getVisibleEventsAllPages() {
    const sorted = getSortedEvents();
    const filtered = getFilteredEvents(sorted);
    return filtered;
  }

  function csvEscape(value) {
    const s = String(value ?? "");
    // Wrap in quotes if needed; double-quote escaping per CSV spec
    if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
    return s;
  }

  function downloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportEventsToCsv() {
    const items = getVisibleEventsAllPages();

    const rows = [
      ["Title", "Date", "Time", "Presenter", "Faculty", "Hall", "Description"],
      ...items.map((ev) => {
        const d = new Date(ev.datetime || ev.date);
        const date = Number.isFinite(d.getTime()) ? d.toLocaleDateString() : "";
        const time = Number.isFinite(d.getTime())
          ? d.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        const presenter = `${ev.presenter_first_name ?? ""} ${
          ev.presenter_last_name ?? ""
        }`.trim();

        return [
          ev.title ?? "",
          date,
          time,
          presenter,
          ev.faculty ?? "",
          ev.hall ?? "",
          ev.event_description ?? ev.description ?? "",
        ];
      }),
    ];

    const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });

    const stamp = new Date().toISOString().slice(0, 10);
    downloadBlob(`events-${stamp}.csv`, blob);
  }

  function exportEventsToPdf() {
    const items = getVisibleEventsAllPages();

    const stamp = new Date().toLocaleString();
    const title = "Upcoming Events";

    const esc = (s) =>
      String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    const rowsHtml = items
      .map((ev) => {
        const d = new Date(ev.datetime || ev.date);
        const date = Number.isFinite(d.getTime()) ? d.toLocaleDateString() : "";
        const time = Number.isFinite(d.getTime())
          ? d.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";
        const presenter = `${ev.presenter_first_name ?? ""} ${
          ev.presenter_last_name ?? ""
        }`.trim();

        return `
          <tr>
            <td><strong>${esc(ev.title)}</strong></td>
            <td>${esc(date)}</td>
            <td>${esc(time)}</td>
            <td>${esc(presenter)}</td>
            <td>${esc(ev.faculty ?? "")}</td>
            <td>${esc(ev.hall ?? "")}</td>
          </tr>
        `;
      })
      .join("");

    // IMPORTANT: don't use noopener/noreferrer here
    const w = window.open("", "_blank");
    if (!w) {
      alert("Popup blocked. Please allow popups for PDF export.");
      return;
    }

    w.document.open();
    w.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Events export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 22px; color: #111; }
            h1 { margin: 0 0 6px 0; font-size: 20px; }
            .meta { margin: 0 0 14px 0; font-size: 12px; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; vertical-align: top; }
            th { background: #f4f4f4; text-align: left; }
            @media print {
              body { padding: 0; }
              .meta { margin-bottom: 10px; }
            }
          </style>
        </head>
        <body>
          <h1>${esc(title)}</h1>
          <p class="meta">Generated: ${esc(stamp)} • Total: ${items.length}</p>
  
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Time</th>
                <th>Presenter</th>
                <th>Faculty</th>
                <th>Hall</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `);
    w.document.close();

    w.onload = () => {
      w.focus();
      w.print();
    };
  }

  function getSortedEvents() {
    const dir = sortSelect?.value || "asc";

    return [...events].sort((a, b) => {
      const da = new Date(a.datetime || a.date).getTime();
      const db = new Date(b.datetime || b.date).getTime();

      console.log(da, db);

      // If any invalid dates slip in, push them to the end
      if (!Number.isFinite(da) && !Number.isFinite(db)) return 0;
      if (!Number.isFinite(da)) return 1;
      if (!Number.isFinite(db)) return -1;

      return dir === "desc" ? db - da : da - db;
    });
  }

  function getSearchQuery() {
    return String(searchInput?.value || "")
      .trim()
      .toLowerCase();
  }

  function getFilteredEvents(sorted) {
    const filter = filterSelect.value;
    const q = getSearchQuery();

    let res = sorted;

    if (filter !== "all") {
      if (filter === "none") res = res.filter((ev) => !getUserInterestId(ev));
      else res = res.filter((ev) => getUserInterestId(ev) === filter);
    }

    if (q) {
      res = res.filter((ev) =>
        String(ev.title || "")
          .toLowerCase()
          .includes(q)
      );
    }

    return res;
  }

  function getTotalPages(count) {
    return Math.max(1, Math.ceil(count / PAGE_SIZE));
  }

  function clampPage(page, totalPages) {
    return Math.min(Math.max(1, page), totalPages);
  }

  function getPageItems(items) {
    const start = (currentPage - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }

  function createPageButton(p) {
    const btn = document.createElement("button");
    btn.className = "page-number";
    btn.type = "button";
    btn.dataset.page = String(p);
    btn.textContent = String(p);
    if (p === currentPage) btn.classList.add("active");
    return btn;
  }

  function createEllipsis() {
    const span = document.createElement("span");
    span.className = "page-ellipsis";
    span.textContent = "…";
    return span;
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      pagination.style.display = "none";
      return;
    }

    pagination.style.display = "flex";
    pageNumbers.innerHTML = "";

    const START_COUNT = 3;
    const END_COUNT = 3;
    const AROUND_CURRENT = 1;

    const pagesToShow = new Set();

    for (let p = 1; p <= Math.min(START_COUNT, totalPages); p++)
      pagesToShow.add(p);

    for (let p = Math.max(1, totalPages - END_COUNT + 1); p <= totalPages; p++)
      pagesToShow.add(p);

    for (
      let p = Math.max(1, currentPage - AROUND_CURRENT);
      p <= Math.min(totalPages, currentPage + AROUND_CURRENT);
      p++
    )
      pagesToShow.add(p);

    const sortedPages = [...pagesToShow].sort((a, b) => a - b);

    let prevPage = null;
    for (const p of sortedPages) {
      if (prevPage !== null && p - prevPage > 1) {
        pageNumbers.appendChild(createEllipsis());
      }
      pageNumbers.appendChild(createPageButton(p));
      prevPage = p;
    }

    const prevBtn = pagination.querySelector('[data-page="prev"]');
    const nextBtn = pagination.querySelector('[data-page="next"]');
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  function renderFilter() {
    filterSelect.innerHTML = `
      <option value="all">All</option>
      <option value="none">No status</option>
      ${interests
        .map((i) => `<option value="${i.id}">${escapeHtml(i.name)}</option>`)
        .join("")}
    `;
    filterSelect.disabled = false;
  }

  function renderList() {
    const sorted = getSortedEvents();
    const filtered = getFilteredEvents(sorted);
    const totalPages = getTotalPages(filtered.length);

    currentPage = clampPage(currentPage, totalPages);

    list.innerHTML = "";

    const pageItems = getPageItems(filtered);

    if (pageItems.length === 0) {
      msg.style.display = "block";
      msg.textContent = "No events match this filter.";
      renderPagination(1);
      return;
    }

    msg.style.display = "none";

    for (const ev of pageItems) {
      list.appendChild(eventRowElement(ev, interests));
    }

    renderPagination(totalPages);
  }

  // ---------- Actions ----------
  const loadAction = createAsyncAction(async () => {
    const [evs, ints] = await Promise.all([
      eventsService.list(),
      eventsService.listInterests(),
    ]);
    console.log(evs);
    console.log(ints);
    return { events: evs, interests: ints };
  });

  const updateStatusAction = createAsyncAction(
    async ({ eventId, interestId }) => {
      await eventsService.setInterest(eventId, interestId);
      return { eventId, interestId };
    }
  );

  // ---------- Subscriptions ----------
  const unsubLoad = loadAction.subscribe((s) => {
    if (s.status === "idle") return;

    if (s.status === "loading") {
      msg.style.display = "block";
      msg.textContent = "Loading events…";
      filterSelect.disabled = true;
      return;
    }

    if (s.status === "error") {
      msg.style.display = "block";
      msg.textContent = "Failed to load events.";
      filterSelect.disabled = true;
      pagination.style.display = "none";
      list.innerHTML = "";
      return;
    }

    if (s.status === "success") {
      events = s.data.events ?? [];
      interests = s.data.interests ?? [];

      renderFilter();
      currentPage = 1;
      renderList();
    }
  });

  const unsubUpdate = updateStatusAction.subscribe((s) => {
    // Optional: you can show a tiny message while saving
    if (s.status === "loading") {
      // could show "Saving..." somewhere, but keeping it quiet is fine
      return;
    }

    if (s.status === "error") {
      // easiest: reload to ensure UI is correct if save fails
      loadAction.run();
    }
  });

  // ---------- Event handlers (attached ONCE) ----------
  function onPaginationClick(e) {
    const btn = e.target.closest("button");
    if (!btn) return;

    const sorted = getSortedEvents();
    const filtered = getFilteredEvents(sorted);
    const totalPages = getTotalPages(filtered.length);

    const page = btn.dataset.page;

    if (page === "prev") currentPage -= 1;
    else if (page === "next") currentPage += 1;
    else currentPage = Number(page);

    currentPage = clampPage(currentPage, totalPages);
    renderList();
  }

  function onFilterChange() {
    currentPage = 1;
    renderList();
  }

  function onListChange(e) {
    const select = e.target.closest("select.status-select");
    if (!select) return;

    const eventId = Number(select.dataset.eventId || 0);
    const interestId = Number(select.value || 0);

    // optimistic update
    const ev = events.find((x) => String(x.id) === String(eventId));
    if (ev) {
      ev.user_interest_id = interestId || null;
      ev.user_interest =
        interests.find((i) => i.id === interestId)?.name ?? null;
    }

    renderList();

    updateStatusAction.run({ eventId, interestId });
  }

  function onSortChange() {
    currentPage = 1;
    renderList();
  }

  function onSearchInput() {
    currentPage = 1;
    renderList();
  }

  function onExportCsv() {
    exportEventsToCsv();
  }

  function onExportPdf() {
    exportEventsToPdf();
  }

  pagination.addEventListener("click", onPaginationClick);
  filterSelect.addEventListener("change", onFilterChange);
  list.addEventListener("change", onListChange); // event delegation
  sortSelect.addEventListener("change", onSortChange);
  searchInput.addEventListener("input", onSearchInput);
  exportCsvBtn.addEventListener("click", onExportCsv);
  exportPdfBtn.addEventListener("click", onExportPdf);

  loadAction.run();

  return () => {
    unsubLoad();
    unsubUpdate();
    pagination.removeEventListener("click", onPaginationClick);
    filterSelect.removeEventListener("change", onFilterChange);
    list.removeEventListener("change", onListChange);
    sortSelect.removeEventListener("change", onSortChange);
    searchInput.removeEventListener("input", onSearchInput);
    exportCsvBtn.removeEventListener("click", onExportCsv);
    exportPdfBtn.removeEventListener("click", onExportPdf);
  };
}
