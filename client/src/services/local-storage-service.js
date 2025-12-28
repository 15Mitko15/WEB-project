export class LocalStorageServer {
  constructor(key) {}

  get() {
    const value = localStorage.getItem(this.key);

    if (!value) {
      return undefined;
    }

    return this.safeParseJson(value);
  }

  set(value) {
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  clear() {
    localStorage.removeItem(this.key);
  }

  safeParseJson(value) {
    try {
      return JSON.parse(value);
    } catch {
      this.clear();
    }
  }
}
