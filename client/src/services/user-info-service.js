import { LocalStorageServer } from "./local-storage-service.js";

export const LOCAL_STORAGE_USER = "user";

class UserInfoService {
  handler = null;
  storage;

  constructor() {
    this.storage = new LocalStorageServer(LOCAL_STORAGE_USER);
  }

  setHandler(handler) {
    this.handler = handler;
  }

  save(user) {
    if (!user || typeof user !== "object") return;
    this.storage.set(JSON.stringify(user));
    this.handler?.(user);
  }

  clear() {
    this.storage.clear();
    this.handler?.(null);
  }

  get currentUser() {
    const raw = this.storage.get();
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      this.storage.clear();
      return null;
    }
  }
}

export const userInfoService = new UserInfoService();
