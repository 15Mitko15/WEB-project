export function Button({
  label,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  onClick,
} = {}) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.className = `btn btn--${variant} btn--${size}`;
  btn.textContent = label ?? "Button";
  btn.disabled = Boolean(disabled);

  if (onClick) btn.addEventListener("click", onClick);
  return btn;
}
