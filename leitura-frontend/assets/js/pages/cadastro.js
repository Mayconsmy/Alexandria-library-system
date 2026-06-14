async function handleCadastro(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  const confirmSenha = document.getElementById('confirmSenha').value;
  const submitBtn = document.querySelector('#cadastroForm button[type="submit"]');
  const errorDiv = document.getElementById('cadastroError');

  errorDiv.classList.add('hidden');

  if (senha !== confirmSenha) {
    errorDiv.textContent = 'Senhas não conferem';
    errorDiv.classList.remove('hidden');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Cadastrando...';

  try {
    const data = await apiRequest('/auth/cadastro', {
      method: 'POST',
      body: { nome, email, senha },
    });

    alert('Cadastro realizado com sucesso! Faça login para continuar.');
    window.location.href = '/';
  } catch (err) {
    errorDiv.textContent = err.message;
    errorDiv.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Cadastrar';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    window.location.href = '/pages/dashboard.html';
  }
  document.getElementById('cadastroForm').addEventListener('submit', handleCadastro);
});
