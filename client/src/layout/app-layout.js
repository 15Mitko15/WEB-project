import { authService } from "../services/auth-service.js";

export function renderAppLayout(rootEl) {
  rootEl.innerHTML = `
    <div class="app">
      <header class="topbar">
        <div class="topbar__left">
          <button id="homeBtn" class="topbar__home" type="button" aria-label="Home">
            Home
          </button>
        </div>

        <div class="topbar__right">
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
              <button id="viewEventsBtn" class="menu__item" type="button" role="menuitem">
                View my events
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
  const viewEventsBtn = rootEl.querySelector("#viewEventsBtn");
  const logoutBtn = rootEl.querySelector("#logoutBtn");

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
    // close if click is outside menu button/panel
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
    window.location.hash = "#/";
  }

  function onAddEvent() {
    closeMenu();
    window.location.hash = "#/create";
  }

  function onViewEvents() {
    closeMenu();
    // no-op for now
    // later: window.location.hash = "#/events";
  }

  homeBtn.addEventListener("click", onHome);
  menuBtn.addEventListener("click", toggleMenu);
  logoutBtn.addEventListener("click", onLogout);
  addEventBtn.addEventListener("click", onAddEvent);
  viewEventsBtn.addEventListener("click", onViewEvents);

  document.addEventListener("click", onDocumentClick);
  document.addEventListener("keydown", onKeyDown);

  return {
    outlet,
    destroy() {
      homeBtn.removeEventListener("click", onHome);
      menuBtn.removeEventListener("click", toggleMenu);
      logoutBtn.removeEventListener("click", onLogout);
      addEventBtn.removeEventListener("click", onAddEvent);
      viewEventsBtn.removeEventListener("click", onViewEvents);

      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
    },
  };
}
