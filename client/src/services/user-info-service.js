import { LocalStorageServer } from "./local-storage-service.js";
import { decodeJwt } from "./jwt-decode-service.js";

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

  // remove token related stuff for now
  save(user) {
    // const user = this.getUserFromToken(token);
    this.storage.set(user);
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

    console.log(token);
    return this.getUserFromToken(token);
  }

  // Remove token for now
  getUserFromToken(user) {
    return {
      // userId: user.userId,
      name: user.name,
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

  // requireValidSession() {
  //   const token = this.storage.get();
  //   if (!this.isTokenValid(token)) {
  //     this.clear();
  //     return null;
  //   }
  //   return this.getUserFromToken(token);
  // }
}

export const userInfoService = new UserInfoService();
