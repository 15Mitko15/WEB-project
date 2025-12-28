import { LocalStorageServer } from "./local-storage-service";
import { decodeJwt } from "./jwt-decode-service";

// This information should be coming from the backend
export const LOCAL_STORAGE_USER = "some-user";

class UserInfoService {
  handler = null;
  storage;

  constructor() {
    this.storage = new LocalStorageServer(LOCAL_STORAGE_USER);
  }

  setHandler(handler) {
    this.handler = handler;
  }

  save(token) {
    const user = this.getUserFromToken(token);
    this.storage.set(token);
    this.handler?.(user);
  }

  clear() {
    this.storage.clear();
    this.handler?.(null);
  }

  get authToken() {
    return this.storage.get();
  }

  get initialUser() {
    const token = this.storage.get();
    if (!token) return null;
    return this.getUserFromToken(token);
  }

  getUserFromToken(token) {
    const decoded = decodeJwt(token);
    return {
      userId: decoded.userId,
      name: decoded.name,
    };
  }

  isTokenValid(token = this.storage.get()) {
    if (!token) return false;

    try {
      const decoded = decodeJwt(token);
      const expMs = decoded?.exp ? decoded.exp * 1000 : 0;
      return expMs > Date.now();
    } catch {
      return false;
    }
  }

  requireValidSession() {
    const token = this.storage.get();
    if (!this.isTokenValid(token)) {
      this.clear();
      return null;
    }
    return this.getUserFromToken(token);
  }
}

export const userInfoService = new UserInfoService();
