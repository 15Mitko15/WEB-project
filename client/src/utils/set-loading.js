export function setLoading(buttonEl, isLoading, loadingText = "Loading...") {
  if (!buttonEl) return;

  if (!buttonEl.dataset.originalLabel) {
    buttonEl.dataset.originalLabel = buttonEl.textContent || "";
  }

  buttonEl.disabled = Boolean(isLoading);
  buttonEl.textContent = isLoading
    ? loadingText
    : buttonEl.dataset.originalLabel;
}
