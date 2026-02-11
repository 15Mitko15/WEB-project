import { authService } from "../services/auth-service.js";
import { userInfoService } from "../services/user-info-service.js";

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getWelcomeName(user) {
  // Try common shapes
  const first =
    user?.first_name ?? user?.firstName ?? user?.name?.split?.(" ")?.[0] ?? "";
  const last =
    user?.last_name ??
    user?.lastName ??
    user?.name?.split?.(" ")?.slice?.(1).join(" ") ??
    "" ??
    "";

  const full = `${first} ${last}`.trim();
  if (full) return full;

  const email = user?.email ?? user?.user_email ?? "";
  if (email) return email;

  return "";
}

export function renderAppLayout(rootEl) {
  const user = userInfoService.currentUser;
  const welcomeName = getWelcomeName(user);

  rootEl.innerHTML = `
    <div class="app">
      <header class="topbar">
          <button id="homeBtn" class="topbar__home" type="button" aria-label="Home">
            Home
          </button>
        <div class="topbar__right">
            <div class="topbar__welcome" aria-label="Welcome message">
            ${
              welcomeName
                ? `Welcome, <strong>${escapeHtml(welcomeName)}</strong>`
                : `Welcome`
            }
            </div>
          <div class="menu">
            <button
              id="menuBtn"
              class="menu__btn"
              type="button"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Open menu"
              title="Menu"
            >
              <!-- vertical dots icon -->
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="5" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="12" cy="19" r="2"></circle>
              </svg>
            </button>
            <div id="menu" class="menu__panel" role="menu" aria-hidden="true">
                <button id="addEventBtn" class="menu__item" type="button" role="menuitem">
                    Add an event
                </button>

                <button id="teacherPageBtn" class="menu__item" type="button" role="menuitem" style="display:none">
                    Teacher page
                </button>

                <div class="menu__sep" role="separator"></div>
                <button id="logoutBtn" class="menu__item menu__item--danger" type="button" role="menuitem">
                    Logout
                </button>
            </div>
          </div>
        </div>
      </header>

        <main id="outlet" class="app-main">
        <div id="slot"></div>
        </main>
    </div>
  `;

  const outlet = rootEl.querySelector("#slot");

  const homeBtn = rootEl.querySelector("#homeBtn");
  const menuBtn = rootEl.querySelector("#menuBtn");
  const menu = rootEl.querySelector("#menu");
  const addEventBtn = rootEl.querySelector("#addEventBtn");
  const logoutBtn = rootEl.querySelector("#logoutBtn");
  const teacherPageBtn = rootEl.querySelector("#teacherPageBtn");

  const isAdmin = Number(user?.role_id) === 2;

  if (isAdmin) {
    teacherPageBtn.style.display = "block";
  }

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    menu.classList.add("is-open");
    menuBtn.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    isOpen = false;
    menu.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
  }

  function toggleMenu() {
    if (isOpen) closeMenu();
    else openMenu();
  }

  function onDocumentClick(e) {
    if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
      closeMenu();
    }
  }

  function onKeyDown(e) {
    if (e.key === "Escape") closeMenu();
  }

  async function onLogout() {
    closeMenu();
    try {
      await authService.logout();
    } finally {
      window.location.hash = "#/login";
    }
  }

  function onHome() {
    closeMenu();

    const hash = window.location.hash || "#/";
    const isTeacherRoute = hash.startsWith("#/teacher");

    window.location.hash = isTeacherRoute ? "#/teacher/home" : "#/";
  }

  function onAddEvent() {
    closeMenu();
    window.location.hash = "#/create";
  }

  function onViewEvents() {
    closeMenu();
    // later: window.location.hash = "#/events";
  }

  function onTeacherPage() {
    closeMenu();
    window.location.hash = "#/teacher/home";
  }

  homeBtn.addEventListener("click", onHome);
  menuBtn.addEventListener("click", toggleMenu);
  logoutBtn.addEventListener("click", onLogout);
  addEventBtn.addEventListener("click", onAddEvent);

  document.addEventListener("click", onDocumentClick);
  document.addEventListener("keydown", onKeyDown);
  teacherPageBtn.addEventListener("click", onTeacherPage);

  return {
    outlet,
    destroy() {
      homeBtn.removeEventListener("click", onHome);
      menuBtn.removeEventListener("click", toggleMenu);
      logoutBtn.removeEventListener("click", onLogout);
      addEventBtn.removeEventListener("click", onAddEvent);

      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
      teacherPageBtn.removeEventListener("click", onTeacherPage);
    },
  };
}
