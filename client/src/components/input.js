export function Input({
  label,
  name,
  type = "text",
  placeholder,
  value = "",
  onInput,
} = {}) {
  const wrap = document.createElement("label");
  wrap.className = "field";

  const lab = document.createElement("div");
  lab.className = "field__label";
  lab.textContent = label ?? "";
  if (!label) lab.style.display = "none";

  const input = document.createElement("input");
  input.className = "input";
  input.type = type;
  if (name) input.name = name;
  if (placeholder) input.placeholder = placeholder;
  input.value = value;

  if (onInput) {
    input.addEventListener("input", (e) => onInput(input.value, e));
  }

  wrap.append(lab, input);
  return { element: wrap, input };
}
