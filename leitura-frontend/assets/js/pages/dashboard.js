document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  const user = getUser();
  renderNavbar('dashboard.html');

  document.getElementById('userName').textContent = user.nome;
  document.querySelector('.welcome h2').innerHTML = `Bem-vindo, <strong>${escapeHtml(user.nome)}</strong>!`;
});
