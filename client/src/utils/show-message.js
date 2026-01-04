export function showMessage(el, text, { muted = false } = {}) {
  el.style.display = "block";
  el.style.whiteSpace = "pre-wrap";
  el.style.borderColor = muted ? "var(--border)" : "rgba(239,68,68,0.35)";
  el.textContent = text;
}
