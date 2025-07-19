// Very small SPA logic
const navButtons = document.querySelectorAll('nav [data-section]');
const sections   = document.querySelectorAll('.tab');

navButtons.forEach(btn =>
  btn.addEventListener('click', () => {
    const id = btn.dataset.section;
    // UI
    navButtons.forEach(b => b.classList.toggle('active', b === btn));
    sections.forEach(s => s.classList.toggle('active', s.id === id));
    // Load content
    loadSection(id);
  })
);

window.addEventListener('DOMContentLoaded', () => loadSection('announcements'));

function loadSection(section) {
  fetch(`data/${section}.json`)
    .then(res => res.json())
    .then(data => render(section, data))
    .catch(() => render(section, []));
}

function render(section, items) {
  const host = document.getElementById(section);
  if (!items.length) { host.innerHTML = '<p>Nothing yet. Check back soon!</p>'; return; }

  host.innerHTML = items.map(item => {
    switch (section) {
      case 'announcements':
        return `<div class="card"><h3>${item.title}</h3><p>${item.body}</p><time>${item.date}</time></div>`;
      case 'events':
        return `<div class="card"><h3>${item.title}</h3><p>${item.desc}</p><time>${item.when}</time></div>`;
      case 'listings':
        return `<div class="card"><h3>${item.title}</h3><p>${item.desc}</p><p>Contact: ${item.contact}</p></div>`;
      case 'contacts':
        return `<div class="card"><h3>${item.name}</h3><p>${item.role}</p><p>${item.phone}</p></div>`;
    }
  }).join('');
}