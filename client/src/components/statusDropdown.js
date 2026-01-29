export function createStatusDropdown({
  id,
  interests = [],
  initialValue = "",
}) {
  const wrapper = document.createElement("div");
  wrapper.className = "status-dropdown";

  const label = document.createElement("label");
  label.className = "status-label";
  label.setAttribute("for", `status-${id}`);
  label.textContent = "Status:";

  const select = document.createElement("select");
  select.className = "status-select";
  select.id = `status-${id}`;

  // placeholder / "no status"
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select...";
  select.appendChild(placeholder);

  for (const item of interests) {
    const optionEl = document.createElement("option");
    optionEl.value = String(item.id);
    optionEl.textContent = item.name;
    select.appendChild(optionEl);
  }

  select.value = String(initialValue || "");

  wrapper.appendChild(label);
  wrapper.appendChild(select);

  return { wrapper, select };
}
