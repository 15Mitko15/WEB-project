export function Card({ title, body } = {}) {
  const el = document.createElement("section");
  el.className = "card";

  if (title) {
    const h = document.createElement("h2");
    h.className = "card__title";
    h.textContent = title;
    el.appendChild(h);
  }

  const content = document.createElement("div");
  content.className = "card__body";

  if (body instanceof Node) content.appendChild(body);
  else if (typeof body === "string") content.innerHTML = body ?? "";

  el.appendChild(content);
  return el;
}
