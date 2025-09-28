const API_URL = "http://localhost:3000/api/targets";

// Switch tabs
document.querySelectorAll(".tab-btn")?.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Load targets (index.html)
async function loadTargets() {
  const res = await fetch(API_URL);
  const targets = await res.json();
  const tbody = document.querySelector("#targets-table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  targets.forEach((t, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${t.targetName}</td>
      <td>${t.assets}</td>
      <td>${t.priority}</td>
      <td>${t.notes || ""}</td>
    `;
    tbody.appendChild(row);
  });
}

// Load & manage targets (admin.html)
async function loadAdminTargets() {
  const res = await fetch(API_URL);
  const targets = await res.json();
  const tbody = document.querySelector("#admin-table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  targets.forEach((t, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i+1}</td>
      <td contenteditable="true" data-field="targetName">${t.targetName}</td>
      <td contenteditable="true" data-field="assets">${t.assets}</td>
      <td>
        <select data-field="priority">
          <option ${t.priority === "Tier 1" ? "selected" : ""}>Tier 1</option>
          <option ${t.priority === "Tier 2" ? "selected" : ""}>Tier 2</option>
          <option ${t.priority === "Tier 3" ? "selected" : ""}>Tier 3</option>
        </select>
      </td>
      <td contenteditable="true" data-field="notes">${t.notes || ""}</td>
      <td>
        <button onclick="updateTarget(${i}, this)">Save</button>
        <button onclick="deleteTarget(${i})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Add new target
document.getElementById("target-form")?.addEventListener("submit", async e => {
  e.preventDefault();
  const newTarget = {
    targetName: document.getElementById("targetName").value,
    assets: document.getElementById("assets").value,
    priority: document.getElementById("priority").value,
    notes: document.getElementById("notes").value
  };
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTarget)
  });
  e.target.reset();
  loadAdminTargets();
});

// Update target
async function updateTarget(i, btn) {
  const row = btn.closest("tr");
  const updated = {
    targetName: row.querySelector('[data-field="targetName"]').innerText,
    assets: row.querySelector('[data-field="assets"]').innerText,
    priority: row.querySelector('[data-field="priority"]').value,
    notes: row.querySelector('[data-field="notes"]').innerText
  };
  await fetch(`${API_URL}/${i}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated)
  });
  loadAdminTargets();
}

// Delete target
async function deleteTarget(i) {
  await fetch(`${API_URL}/${i}`, { method: "DELETE" });
  loadAdminTargets();
}

/*  // Dark mode toggle
const toggleBtn = document.getElementById("dark-toggle");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggleBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌑";
  });
}
*/


// Initialize
loadTargets();
loadAdminTargets();
