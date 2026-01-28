import { createRouter } from "./pages/router.js";
import { initCurrentUser } from "./contexts/current-user-context.js";

export function app(rootEl) {
  initCurrentUser();
  const router = createRouter(rootEl);
  router.start();
}
