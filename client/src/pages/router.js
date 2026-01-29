import { renderHome } from "../pages/home.js";
import { renderLoginPage } from "../pages/login.js";
import { renderRegisterPage } from "./register.js";
import { PrivateOutlet } from "../outlets/private-outlet.js";
import { renderAppLayout } from "../layout/app-layout.js";
import { renderCreateEventPage } from "../pages/create_event_page.js";
import { renderEventPage } from "../pages/event-page.js";
import { renderTeacherSlotPage } from "../pages/teacher-slot.js";
import { TeacherOutlet } from "../outlets/teacher-outlet.js";

function getPath() {
  const hash = window.location.hash || "#/";
  return hash.replace(/^#/, "");
}

function setHash(path) {
  window.location.hash = `#${path}`;
}

export function createRouter(rootEl) {
  let cleanup = null;

  function runCleanup() {
    if (typeof cleanup === "function") cleanup();
    cleanup = null;
  }

  function render() {
    runCleanup();

    const path = getPath();

    // public routes (no topbar)
    if (path === "/login") {
      cleanup = renderLoginPage(rootEl) || null;
      return;
    }

    if (path === "/register") {
      cleanup = renderRegisterPage(rootEl) || null;
      return;
    }

    // private group
    // private group
    return PrivateOutlet(rootEl, () => {
      const layout = renderAppLayout(rootEl);

      let pageCleanup = null;

      if (path === "/") pageCleanup = renderHome(layout.outlet);
      else if (path === "/create")
        pageCleanup = renderCreateEventPage(layout.outlet);
      else if (path.startsWith("/event/")) {
        const id = path.split("/event/")[1];
        return renderEventPage(layout.outlet, id);
      } else if (path === "/teacher/slot") {
        // Teacher-only page
        return TeacherOutlet(layout.outlet, () =>
          renderTeacherSlotPage(layout.outlet)
        );
      } else setHash("/");

      cleanup = () => {
        if (typeof pageCleanup === "function") pageCleanup();
        layout.destroy?.();
      };
    });
  }

  function start() {
    window.addEventListener("hashchange", render);
    window.addEventListener("load", render);

    if (!window.location.hash) setHash("/");
    render();
  }

  return { start, navigate: setHash };
}
