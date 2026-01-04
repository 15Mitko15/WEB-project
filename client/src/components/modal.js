import { createButton } from "./button.js";

export function Modal({ title = "Modal", content, onClose } = {}) {
  const overlay = document.createElement("div");
  overlay.className = "modal";

  const panel = document.createElement("div");
  panel.className = "modal__panel";

  const header = document.createElement("div");
  header.className = "modal__header";

  const h = document.createElement("div");
  h.className = "modal__title";
  h.textContent = title;

  const closeBtn = createButton({
    label: "Close",
    variant: "ghost",
    onClick: () => close(),
  });

  header.append(h, closeBtn);

  const body = document.createElement("div");
  body.className = "modal__body";
  if (content instanceof Node) body.appendChild(content);
  else body.innerHTML = content ?? "";

  panel.append(header, body);
  overlay.appendChild(panel);

  function open() {
    document.body.appendChild(overlay);
    overlay.addEventListener("click", onOverlay);
    document.addEventListener("keydown", onEsc);
  }

  function close() {
    overlay.removeEventListener("click", onOverlay);
    document.removeEventListener("keydown", onEsc);
    overlay.remove();
    onClose?.();
  }

  function onOverlay(e) {
    if (e.target === overlay) close();
  }

  function onEsc(e) {
    if (e.key === "Escape") close();
  }

  return { open, close, element: overlay };
}
