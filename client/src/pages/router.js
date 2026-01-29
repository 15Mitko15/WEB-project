import { renderHome } from "../pages/home.js";
import { renderLoginPage } from "../pages/login.js";
import { renderRegisterPage } from "./register.js";
import { PrivateOutlet } from "../outlets/private-outlet.js";
import { renderAppLayout } from "../layout/app-layout.js";

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
    return PrivateOutlet(rootEl, () => {
      // render layout once for all private pages
      const layout = renderAppLayout(rootEl);

      // render the actual page inside layout.outlet
      let pageCleanup = null;

      if (path === "/") pageCleanup = renderHome(layout.outlet);
      // if (path === "/create") pageCleanup = renderCreatePropertyPage(layout.outlet);
      else if (path !== "/") setHash("/");

      // combined cleanup: page + layout
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
