async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  const submitBtn = document.querySelector('#loginForm button[type="submit"]');
  const errorDiv = document.getElementById('loginError');

  errorDiv.classList.add('hidden');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Entrando...';

  try {
    await login(email, senha);
    window.location.href = '/pages/dashboard.html';
  } catch (err) {
    errorDiv.textContent = err.message;
    errorDiv.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Entrar';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (redirectIfAuth()) return;
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
});
