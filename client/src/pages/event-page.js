import { createAsyncAction } from "../hooks/async.js";
import { eventsService } from "../services/events-service.js";
import { setLoading } from "../utils/set-loading.js";

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatFullDateTime(dt) {
  const d = new Date(dt);
  const date = d.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}

function formatRelativeOrShort(iso) {
  // Simple display (you can improve later)
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(iso ?? "");
  }
}

// Build a tree from flat comments: parent_id null => top-level
function buildCommentTree(comments) {
  const byId = new Map();
  const roots = [];

  for (const c of comments) {
    const node = { ...c, children: [] };
    byId.set(String(c.id), node);
  }

  for (const c of comments) {
    const node = byId.get(String(c.id));
    const pid = c.parent_id == null ? null : String(c.parent_id);
    if (!pid) {
      roots.push(node);
    } else {
      const parent = byId.get(pid);
      if (parent) parent.children.push(node);
      else roots.push(node);
    }
  }

  function sortNodes(nodes) {
    nodes.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    for (const n of nodes) sortNodes(n.children);
  }
  sortNodes(roots);

  return roots;
}

export function renderEventPage(rootEl, eventId) {
  rootEl.innerHTML = `
    <div class="container container--wide">
      <div class="stack" id="slot">
        <a href="#/" style="color: var(--muted)">← Back to events</a>
        <div class="message" id="msg" style="display:none"></div>
        <div id="content"></div>
      </div>
    </div>
  `;

  const msg = rootEl.querySelector("#msg");
  const content = rootEl.querySelector("#content");

  // Local UI state
  let eventData = null;
  let attendeeGroups = {};
  let activeGroupName = "";
  let comments = [];
  let openReplyFor = null;

  // Actions
  const loadEventAction = createAsyncAction(async (id) => {
    const ev = await eventsService.getEvent(id);
    if (!ev) throw new Error("Event not found");
    return ev;
  });

  const loadAttendeesAction = createAsyncAction(async (id) => {
    return await eventsService.getEventAttendees(id); // object map
  });

  const loadCommentsAction = createAsyncAction(async (id) => {
    return await eventsService.getEventComments(id); // array
  });

  const addCommentAction = createAsyncAction(
    async ({ event_id, body, parent_id }) => {
      const created = await eventsService.addComment({
        event_id,
        body,
        parent_id,
      });
      return created;
    }
  );

  function setMessage(type, text) {
    msg.className = `message ${type ? `message--${type}` : ""}`.trim();
    msg.style.display = "block";
    msg.textContent = text;
  }

  function clearMessage() {
    msg.style.display = "none";
    msg.textContent = "";
  }

  function getGroupNames(groupsObj) {
    const names = Object.keys(groupsObj || {});
    // stable order: try preferred first, then rest
    const preferred = [
      "Interested",
      "Thinking",
      "Thinking of going",
      "Maybe",
      "Going",
    ];
    const ordered = [];
    for (const p of preferred) {
      for (const n of names) {
        if (n.toLowerCase() === p.toLowerCase() && !ordered.includes(n))
          ordered.push(n);
      }
    }
    for (const n of names) {
      if (!ordered.includes(n)) ordered.push(n);
    }
    return ordered;
  }

  function renderAttendeesSection() {
    const groupNames = getGroupNames(attendeeGroups);

    if (!groupNames.length) {
      return `
        <div class="card">
          <div class="card__header">
            <h2 class="section-title">Attendees</h2>
          </div>
          <div class="card__body">
            <p class="empty-state">No responses yet.</p>
          </div>
        </div>
      `;
    }

    if (!activeGroupName || !groupNames.includes(activeGroupName)) {
      activeGroupName = groupNames[0];
    }

    const people = attendeeGroups[activeGroupName] || [];

    const tabs = groupNames
      .map((name) => {
        const count = (attendeeGroups[name] || []).length;
        const active = name === activeGroupName ? "is-active" : "";
        return `<button class="tab ${active}" type="button" data-tab="${escapeHtml(
          name
        )}">
          ${escapeHtml(name)} <span class="tab__count">${count}</span>
        </button>`;
      })
      .join("");

    const listHtml =
      people.length === 0
        ? `<p class="empty-state">No one in this group yet.</p>`
        : `<ul class="people-list">
            ${people
              .map(
                (u) => `<li class="people-item">
                  <span>${escapeHtml(
                    `${u.first_name} ${u.last_name}`.trim()
                  )}</span>
                  <span class="muted">(${escapeHtml(u.fn ?? "")})</span>
                </li>`
              )
              .join("")}
          </ul>`;

    return `
      <div class="card">
        <div class="card__header">
          <h2 style="margin:0; font-size:1.1rem">Attendees</h2>
        </div>
        <div class="card__body stack">
          <div class="tabs" role="tablist" aria-label="Attendee groups">
            ${tabs}
          </div>
          <div class="tab-panel" role="tabpanel">
            ${listHtml}
          </div>
        </div>
      </div>
    `;
  }

  function renderCommentNode(node, depth = 0) {
    const author = `${node.first_name ?? ""} ${node.last_name ?? ""}`.trim();
    const when = formatRelativeOrShort(node.created_at);
    const indent = Math.min(depth, 6) * 16;

    const isOpen = String(openReplyFor) === String(node.id);

    return `
      <div class="comment" style="margin-left:${indent}px">
        <div class="comment__meta">
          <strong>${escapeHtml(author || "User")}</strong>
          <span class="muted">(${escapeHtml(node.fn ?? "")})</span>
          <span class="comment__time">${escapeHtml(when)}</span>
        </div>
        <div class="comment__body">${escapeHtml(node.body)}</div>
        <div class="comment__actions">
          <button class="linkbtn" type="button" data-reply="${node.id}">
            ${isOpen ? "Cancel" : "Reply"}
          </button>
        </div>

        ${
          isOpen
            ? `
          <form class="reply-form" data-reply-form="${node.id}">
            <textarea class="input input--lg textarea" rows="3" placeholder="Write a reply…"></textarea>
            <div class="row">
              <button class="btn btn--primary btn--md" type="submit">Reply</button>
            </div>
          </form>
        `
            : ""
        }

        ${
          node.children && node.children.length
            ? node.children
                .map((ch) => renderCommentNode(ch, depth + 1))
                .join("")
            : ""
        }
      </div>
    `;
  }

  function renderCommentsSection() {
    const tree = buildCommentTree(comments);

    const listHtml =
      tree.length === 0
        ? `<p class="empty-state">No comments yet. Be the first to comment.</p>`
        : `<div class="comments">
            ${tree.map((n) => renderCommentNode(n, 0)).join("")}
          </div>`;

    return `
      <div class="card">
        <div class="card__header">
          <h2 style="margin:0; font-size:1.1rem">Comments</h2>
        </div>
        <div class="card__body stack">
          <form id="newCommentForm" class="stack">
            <textarea id="newCommentBody" class="input input--lg textarea" rows="4" placeholder="Write a comment…"></textarea>
            <div class="row">
              <button id="postCommentBtn" class="btn btn--primary btn--md" type="submit">Post comment</button>
            </div>
          </form>
          <hr />
          ${listHtml}
        </div>
      </div>
    `;
  }

  function renderPage() {
    if (!eventData) {
      content.innerHTML = "";
      return;
    }

    const { date, time } = formatFullDateTime(eventData.datetime);

    // small counts for header
    const groupNames = Object.keys(attendeeGroups || {});
    const counts = groupNames.map((k) => (attendeeGroups[k] || []).length);
    const total = counts.reduce((a, b) => a + b, 0);

    content.innerHTML = `
      <div class="event-page">
        <header class="event-hero">
          <div class="event-hero__top">
            <div>
              <h1 class="event-title-xl">${escapeHtml(eventData.title)}</h1>
              <div class="event-meta">
                <span class="chip">${escapeHtml(date)}</span>
                <span class="chip">${escapeHtml(time)}</span>
                <span class="chip">Faculty: ${escapeHtml(
                  eventData.faculty ?? ""
                )}</span>
                <span class="chip">Hall: ${escapeHtml(
                  eventData.hall ?? ""
                )}</span>
              </div>
            </div>
  
            <div class="event-hero__side">
              <div class="event-presenter">
                <div class="muted-sm">Presenter</div>
                <div class="presenter-name">
                  ${escapeHtml(
                    `${eventData.presenter_first_name} ${eventData.presenter_last_name}`.trim()
                  )}
                </div>
                <div class="muted-sm">${escapeHtml(
                  eventData.presenter_fn ? `FN: ${eventData.presenter_fn}` : ""
                )}</div>
              </div>
  
              <div class="event-stats">
                <div class="stat">
                  <div class="stat__num">${total}</div>
                  <div class="stat__label">Responses</div>
                </div>
              </div>
            </div>
          </div>
  
          <div class="event-description">
            <div class="muted-sm">Description</div>
            <p class="event-description-full">${escapeHtml(
              eventData.event_description ?? ""
            )}</p>
          </div>
        </header>
  
        <div class="event-layout">
          <main class="event-maincol">
            ${renderCommentsSection()}
          </main>
  
          <aside class="event-sidecol">
            ${renderAttendeesSection()}
          </aside>
        </div>
      </div>
    `;

    wireHandlers();
  }

  // --- Handlers (re-attached after each render; we remove previous by using delegation + single root listeners) ---
  function onContentClick(e) {
    const tabBtn = e.target.closest("button[data-tab]");
    if (tabBtn) {
      activeGroupName = tabBtn.dataset.tab || "";
      renderPage();
      return;
    }

    const replyBtn = e.target.closest("button[data-reply]");
    if (replyBtn) {
      const id = replyBtn.dataset.reply;
      openReplyFor = String(openReplyFor) === String(id) ? null : id;
      renderPage();
      return;
    }
  }

  async function onContentSubmit(e) {
    const newCommentForm = e.target.closest("#newCommentForm");
    if (newCommentForm) {
      e.preventDefault();
      const textarea = content.querySelector("#newCommentBody");
      const btn = content.querySelector("#postCommentBtn");
      const body = String(textarea?.value || "").trim();
      if (!body) {
        setMessage("error", "Please write a comment.");
        return;
      }
      clearMessage();

      try {
        setLoading(btn, true, "Posting…");
        await addCommentAction.run({
          event_id: Number(eventId),
          body,
          parent_id: null,
        });
        textarea.value = "";
        openReplyFor = null;
        // reload comments
        loadCommentsAction.run(eventId);
      } finally {
        setLoading(btn, false);
      }
      return;
    }

    const replyForm = e.target.closest("form[data-reply-form]");
    if (replyForm) {
      e.preventDefault();
      const parentId = Number(replyForm.dataset.replyForm || 0);
      const textarea = replyForm.querySelector("textarea");
      const body = String(textarea?.value || "").trim();
      if (!body) {
        setMessage("error", "Please write a reply.");
        return;
      }
      clearMessage();

      const submitBtn = replyForm.querySelector('button[type="submit"]');
      try {
        setLoading(submitBtn, true, "Posting…");
        await addCommentAction.run({
          event_id: Number(eventId),
          body,
          parent_id: parentId,
        });
        openReplyFor = null;
        // reload comments
        loadCommentsAction.run(eventId);
      } finally {
        setLoading(submitBtn, false);
      }
      return;
    }
  }

  let handlersWired = false;
  function wireHandlers() {
    if (handlersWired) return;
    handlersWired = true;
    content.addEventListener("click", onContentClick);
    content.addEventListener("submit", onContentSubmit);
  }

  // --- Subscriptions ---
  const unsubEvent = loadEventAction.subscribe((s) => {
    if (s.status === "loading") {
      setMessage("warning", "Loading event…");
      content.innerHTML = "";
      return;
    }
    if (s.status === "error") {
      setMessage("error", s.error?.message || "Failed to load event.");
      content.innerHTML = "";
      return;
    }
    if (s.status === "success") {
      clearMessage();
      eventData = s.data;
      renderPage();
    }
  });

  const unsubAttendees = loadAttendeesAction.subscribe((s) => {
    if (s.status === "error") {
      // don't break page; just keep attendees empty
      attendeeGroups = {};
      renderPage();
      return;
    }
    if (s.status === "success") {
      attendeeGroups = s.data || {};
      renderPage();
    }
  });

  const unsubComments = loadCommentsAction.subscribe((s) => {
    if (s.status === "error") {
      comments = [];
      renderPage();
      return;
    }
    if (s.status === "success") {
      comments = Array.isArray(s.data) ? s.data : [];
      renderPage();
    }
  });

  const unsubAdd = addCommentAction.subscribe((s) => {
    if (s.status === "error") {
      setMessage("error", s.error?.message || "Failed to post comment.");
    }
  });

  // --- Start loading ---
  loadEventAction.run(eventId);
  loadAttendeesAction.run(eventId);
  loadCommentsAction.run(eventId);

  // Cleanup
  return () => {
    unsubEvent();
    unsubAttendees();
    unsubComments();
    unsubAdd();
    content.removeEventListener("click", onContentClick);
    content.removeEventListener("submit", onContentSubmit);
  };
}
