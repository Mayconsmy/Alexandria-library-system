async function loadProfile() {
  const user = getUser();
  const loading = document.getElementById('loading');
  const content = document.getElementById('profileContent');

  loading.classList.remove('hidden');
  content.classList.add('hidden');

  try {
    const [profile, stats] = await Promise.all([
      buscarUsuario(user.id),
      buscarEstatisticas(user.id),
    ]);

    document.getElementById('profileName').textContent = profile.nome;
    document.getElementById('profileEmail').textContent = profile.email;
    document.getElementById('profileType').textContent = `Tipo: ${profile.tipoPerfil || 'leitor'}`;
    document.getElementById('profileSince').textContent = `Membro desde ${formatDate(profile.dataCadastro)}`;

    document.getElementById('statLidos').textContent = stats.livrosLidos || 0;
    document.getElementById('statLendo').textContent = stats.livrosEmLeitura || 0;
    document.getElementById('statDesejados').textContent = stats.livrosDesejados || 0;

    content.classList.remove('hidden');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    loading.classList.add('hidden');
  }
}

function showEditProfileModal() {
  const user = getUser();

  openModal('Editar Perfil', `
    <div class="form-group">
      <label>Nome</label>
      <input type="text" id="editNome" value="${escapeHtml(user.nome)}" required>
    </div>
    <div class="form-group">
      <label>Foto de perfil (URL)</label>
      <input type="url" id="editFoto" placeholder="https://exemplo.com/foto.jpg">
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" id="confirmEditProfile">Salvar</button>
  `);

  document.getElementById('confirmEditProfile').addEventListener('click', async () => {
    const nome = document.getElementById('editNome').value.trim();
    const fotoPerfil = document.getElementById('editFoto').value.trim() || null;

    if (!nome) {
      showToast('Nome é obrigatório', 'warning');
      return;
    }

    try {
      const updated = await atualizarUsuario(user.id, {
        id: user.id,
        nome,
        fotoPerfil,
        email: user.email,
      });

      saveAuth(getToken(), { id: user.id, nome: updated.nome, email: user.email });
      closeModal();
      showToast('Perfil atualizado!', 'success');
      loadProfile();
      renderNavbar('perfil.html');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderNavbar('perfil.html');
  loadProfile();

  document.getElementById('editProfileBtn').addEventListener('click', showEditProfileModal);
});
