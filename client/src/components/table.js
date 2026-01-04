export function Table({
  columns = [],
  rows = [],
  emptyText = "No data.",
} = {}) {
  const wrap = document.createElement("div");
  wrap.className = "table";

  const table = document.createElement("table");
  table.className = "table__el";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const col of columns) {
    const th = document.createElement("th");
    th.textContent = col.label ?? col.key;
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);

  const tbody = document.createElement("tbody");

  if (!rows.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = Math.max(columns.length, 1);
    td.className = "table__empty";
    td.textContent = emptyText;
    tr.appendChild(td);
    tbody.appendChild(tr);
  } else {
    for (const row of rows) {
      const tr = document.createElement("tr");
      for (const col of columns) {
        const td = document.createElement("td");

        const rendered = col.render ? col.render(row) : row[col.key];
        if (rendered instanceof Node) td.appendChild(rendered);
        else td.textContent = rendered == null ? "" : String(rendered);

        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  }

  table.append(thead, tbody);
  wrap.appendChild(table);
  return wrap;
}
