import { http } from "./http-service.js";
import { userInfoService } from "./user-info-service.js";

// Hardcoded endpoints - need to get from backend
const API_BASE = "http://localhost:3000";

const ENDPOINTS = {
  register: `${API_BASE}/auth/register`,
  login: `${API_BASE}/auth/login`,
  logout: `${API_BASE}/auth/logout`,
  me: `${API_BASE}/auth/me`,
};

export class AuthService {
  logout() {
    userInfoService.clear();
  }

  async register({ username, email, password }) {
    const passwordToSend = password;

    await http.post(ENDPOINTS.register, {
      body: {
        username,
        email,
        password: passwordToSend,
      },
    });

    // auto login after register
    return this.login(email, password);
  }

  async login(email, password) {
    const passwordToSend = password;

    const data = await http.post(ENDPOINTS.login, {
      body: {
        email,
        password: passwordToSend,
      },
    });

    if (!data?.token) {
      throw new Error("Login failed: no token returned");
    }

    userInfoService.save(data.token);

    return userInfoService.getUserFromToken(data.token);
  }

  async loadSession() {
    if (!userInfoService.isTokenValid()) {
      return null;
    }

    try {
      const user = await this.get(ENDPOINTS.me);
      this.handler?.(user);
      return user;
    } catch {
      this.logout();
      return null;
    }
  }
}

export const authService = new AuthService();
