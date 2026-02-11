import { renderHome } from "../pages/home.js";
import { renderLoginPage } from "../pages/login.js";
import { renderRegisterPage } from "./register.js";
import { PrivateOutlet } from "../outlets/private-outlet.js";
import { renderAppLayout } from "../layout/app-layout.js";
import { renderCreateEventPage } from "../pages/create_event_page.js";
import { renderEventPage } from "../pages/event-page.js";
import { renderTeacherSlotAddPage } from "../teacher-panel/pages/teacher-slot-add.js";
import { TeacherOutlet } from "../outlets/teacher-outlet.js";
import { renderTeacherHome } from "../teacher-panel/pages/teacher-home.js";
import { renderTeacherSlotsViewPage } from "../teacher-panel/pages/teacher-slots-view.js";
import { renderEventEditPage } from "../pages/edit_event_page.js";

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
      else if (path.startsWith("/event/") && path.endsWith("/edit")) {
        const id = path.split("/event/")[1].replace("/edit", "");
        return renderEventEditPage(layout.outlet, id);
      } else if (path.startsWith("/event/")) {
        const id = path.split("/event/")[1];
        return renderEventPage(layout.outlet, id);
      } else if (path === "/teacher/slot/add") {
        // Teacher-only page
        return TeacherOutlet(layout.outlet, () =>
          renderTeacherSlotAddPage(layout.outlet)
        );
      } else if (path === "/teacher/home") {
        return TeacherOutlet(layout.outlet, () =>
          renderTeacherHome(layout.outlet)
        );
      } else if (path === "/teacher/slots") {
        return TeacherOutlet(layout.outlet, () =>
          renderTeacherSlotsViewPage(layout.outlet)
        );
      } else if (path === "/teacher/events") {
        return TeacherOutlet(layout.outlet, () => renderHome(layout.outlet));
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
