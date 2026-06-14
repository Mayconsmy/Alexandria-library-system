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
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, senha },
    });

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify({
      id: data.id,
      nome: data.nome,
      email: data.email,
    }));

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
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    window.location.href = '/pages/dashboard.html';
  }
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
});
