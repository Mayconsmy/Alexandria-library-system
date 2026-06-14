function loadUserInfo() {
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) {
    window.location.href = '/';
    return;
  }

  const user = JSON.parse(userData);
  document.getElementById('userName').textContent = user.nome;
  document.getElementById('userEmail').textContent = user.email;
}

function handleLogout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', () => {
  loadUserInfo();
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});
