import { http } from "./http-service.js";
import { userInfoService } from "./user-info-service.js";

const ENDPOINTS = {
  register: `auth/register`,
  login: `auth/login`,
  logout: `auth/logout`,
  me: `auth/me`,
};

export class AuthService {
  async register({ name, email, password, fn }) {
    await http.post(ENDPOINTS.register, {
      body: { name, email, password, fn },
    });

    await this.login(email, password);

    return this.me();
  }

  async login(email, password) {
    const { result } = await http.post(ENDPOINTS.login, {
      body: { email, password },
    });

    if (result?.user) {
      userInfoService.save(result.user);
      this.handler?.(result.user);
      return result.user;
    }

    return this.me();
  }

  async logout() {
    try {
      await http.post(ENDPOINTS.logout);
    } finally {
      userInfoService.clear();
      this.handler?.(null);
    }
  }

  async me() {
    const { result } = await http.get(ENDPOINTS.me);

    const user = result?.user ?? result;

    userInfoService.save(user);
    this.handler?.(user);
    return user;
  }

  async loadSession() {
    try {
      return await this.me();
    } catch {
      this.handler?.(null);
      return null;
    }
  }

  onChange(handler) {
    this.handler = handler;
  }
}

export const authService = new AuthService();
