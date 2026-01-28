import { userInfoService } from "../services/user-info-service.js";

let currentUser = null;
let initialized = false;
const listeners = new Set();

export function getCurrentUser() {
  return currentUser;
}

export function subscribeCurrentUser(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setCurrentUser(user) {
  currentUser = user;
  for (const fn of listeners) fn(user);
}

export function initCurrentUser() {
  if (initialized) return;
  initialized = true;

  currentUser = userInfoService.initialUser;
  userInfoService.setHandler(setCurrentUser);
}
