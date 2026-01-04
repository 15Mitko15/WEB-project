import { renderHome } from "../pages/home.js";
import { renderLoginPage } from "../pages/login.js";
import { renderRegisterPage } from "./register.js";

import { PrivateOutlet } from "../outlets/private-outlet.js";

function getPath() {
  const hash = window.location.hash || "#/";
  return hash.replace(/^#/, "");
}

function setHash(path) {
  window.location.hash = `#${path}`;
}

export function createRouter(rootEl) {
  function render() {
    const path = getPath();

    console.log("BROOOO1");

    // public routes
    if (path === "/login") return renderLoginPage(rootEl);
    if (path === "/register") {
      console.log("BROOOO");
      return renderRegisterPage(rootEl);
    }

    console.log("IN HEREE");

    // private group (equivalent to <Route element={<PrivateOutlet/>}>)
    return PrivateOutlet(rootEl, () => {
      // nested providers (equivalent to CitiesProvider -> NeighborhoodsProvider -> PropertiesProvider -> <Outlet/>)

      if (path === "/") return renderHome(rootEl);
      // if (path === "/create") return renderCreatePropertyPage(rootEl);

      setHash("/");
    });
  }

  function start() {
    window.addEventListener("hashchange", render);
    window.addEventListener("load", render);

    // ensure we have a route
    if (!window.location.hash) setHash("/");
    render();
  }

  return { start, navigate: setHash };
}
