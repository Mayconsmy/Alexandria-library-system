function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.setAttribute('aria-label', isDark ? 'Ativar modo escuro' : 'Ativar modo claro');
    btn.innerHTML = isDark
      ? '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  }
}

function renderNavbar(activePage) {
  const user = getUser();
  if (!user) return;

  const nav = document.getElementById('topbar');
  if (!nav) return;

  const links = [
    { href: 'dashboard.html', label: 'Dashboard' },
    { href: 'biblioteca.html', label: 'Biblioteca' },
    { href: 'leituras.html', label: 'Leituras' },
    { href: 'grupos.html', label: 'Grupos' },
    { href: 'resenhas.html', label: 'Resenhas' },
    { href: 'metas.html', label: 'Metas' },
    { href: 'perfil.html', label: 'Perfil' },
  ];

  const avatarConfig = getAvatarConfig(user.fotoPerfil);
  const avatarSVG = renderAvatarSVG(avatarConfig, 28);
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  nav.innerHTML = `
    <div class="topbar-brand">
      <img src="../assets/img/logo.svg" alt="Alexandria">
      <h1><span>Alexandria</span></h1>
    </div>
    <nav class="topbar-nav" aria-label="Navegação principal">
      ${links.map(l => `
        <a href="${l.href}" class="${activePage === l.href ? 'active' : ''}">${l.label}</a>
      `).join('')}
    </nav>
    <div class="topbar-user">
      <button id="themeToggle" class="btn-theme" type="button" aria-label="${isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}">
        ${isDark
          ? '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
          : '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
        }
      </button>
      <div class="topbar-avatar" role="img" aria-label="Avatar do usuário">${avatarSVG}</div>
      <span>${escapeHtml(user.nome)}</span>
      <button class="btn-logout" onclick="handleLogout()" aria-label="Sair">Sair</button>
    </div>
  `;

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
}

function handleLogout() {
  clearAuth();
  window.location.href = '/';
}
