const KEY = "tareas";
let tareas = [];
let filtro = "todas";

try { tareas = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { tareas = []; }

function guardar() {
  try { localStorage.setItem(KEY, JSON.stringify(tareas)); } catch (e) {}
}

function render() {
  const ul = document.getElementById("lista");
  ul.innerHTML = "";
  const visibles = tareas.filter(t =>
    filtro === "todas" || (filtro === "hechas" ? t.hecha : !t.hecha));
  if (!visibles.length) {
    const p = document.createElement("div");
    p.className = "vacio";
    p.textContent = "No hay tareas aquí.";
    ul.appendChild(p);
  }
  visibles.forEach(t => {
    const li = document.createElement("li");
    if (t.hecha) li.className = "hecha";
    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.checked = t.hecha;
    cb.onchange = () => { t.hecha = cb.checked; guardar(); render(); };
    const span = document.createElement("span");
    span.textContent = t.titulo;
    const del = document.createElement("button");
    del.textContent = "✕"; del.setAttribute("aria-label", "Eliminar");
    del.onclick = () => { tareas = tareas.filter(x => x.id !== t.id); guardar(); render(); };
    li.append(cb, span, del);
    ul.appendChild(li);
  });
  const pend = tareas.filter(t => !t.hecha).length;
  document.getElementById("contador").textContent =
    pend + (pend === 1 ? " pendiente" : " pendientes");
}

document.getElementById("form").onsubmit = e => {
  e.preventDefault();
  const input = document.getElementById("nueva");
  const titulo = input.value.trim();
  if (!titulo) return;
  tareas.push({ id: Date.now(), titulo, hecha: false });
  input.value = "";
  guardar(); render();
};

document.getElementById("filtros").onclick = e => {
  if (!e.target.dataset.f) return;
  filtro = e.target.dataset.f;
  document.querySelectorAll("#filtros button").forEach(b =>
    b.classList.toggle("on", b === e.target));
  render();
};

document.getElementById("limpiar").onclick = () => {
  tareas = tareas.filter(t => !t.hecha);
  guardar(); render();
};

render();