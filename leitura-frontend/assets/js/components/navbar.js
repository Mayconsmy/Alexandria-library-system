function renderNavbar(activePage) {
  const user = getUser();
  if (!user) return;

  const nav = document.getElementById('topbar');
  if (!nav) return;

  const links = [
    { href: 'dashboard.html', label: 'Dashboard', icon: '🏠' },
    { href: 'biblioteca.html', label: 'Biblioteca', icon: '📚' },
    { href: 'grupos.html', label: 'Grupos', icon: '👥' },
    { href: 'metas.html', label: 'Metas', icon: '🎯' },
    { href: 'perfil.html', label: 'Perfil', icon: '👤' },
  ];

  nav.innerHTML = `
    <div class="topbar-brand">
      <img src="../assets/img/logo.svg" alt="Alexandria">
      <h1><span>Alexandria</span></h1>
    </div>
    <nav class="topbar-nav">
      ${links.map(l => `
        <a href="${l.href}" class="${activePage === l.href ? 'active' : ''}">${l.label}</a>
      `).join('')}
    </nav>
    <div class="topbar-user">
      <span>${escapeHtml(user.nome)}</span>
      <button class="btn-logout" onclick="handleLogout()">Sair</button>
    </div>
  `;
}

function handleLogout() {
  clearAuth();
  window.location.href = '/';
}
