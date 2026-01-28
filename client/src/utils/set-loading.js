export function setLoading(buttonEl, isLoading) {
  buttonEl.disabled = isLoading;
  buttonEl.textContent = isLoading ? "Logging in..." : "Login";
}
