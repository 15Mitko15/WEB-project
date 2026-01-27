// src/components/statusDropdown.js

const OPTIONS = [
  { value: "interested", label: "Interested" },
  { value: "going", label: "Going" },
  { value: "not_going", label: "Not going" },
];

export function createStatusDropdown({ id, initialValue = "" }) {
  const wrapper = document.createElement("div");
  wrapper.className = "status-dropdown";

  const label = document.createElement("label");
  label.className = "status-label";
  label.setAttribute("for", `status-${id}`);
  label.textContent = "Status:";

  const select = document.createElement("select");
  select.className = "status-select";
  select.id = `status-${id}`;

  // placeholder option
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select…";
  select.appendChild(placeholder);

  for (const opt of OPTIONS) {
    const optionEl = document.createElement("option");
    optionEl.value = opt.value;
    optionEl.textContent = opt.label;
    select.appendChild(optionEl);
  }

  select.value = initialValue;

  wrapper.appendChild(label);
  wrapper.appendChild(select);

  return { wrapper, select };
}
