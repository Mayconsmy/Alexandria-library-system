let editAvatarConfig = null;

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

    const avatarConfig = getAvatarConfig(profile.fotoPerfil);
    renderAvatar('profileAvatar', avatarConfig, 96);

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
  editAvatarConfig = getAvatarConfig(user.fotoPerfil);

  openModal('Editar Perfil', `
    <div class="form-group">
      <label>Nome</label>
      <input type="text" id="editNome" value="${escapeHtml(user.nome)}" required>
    </div>
    <div class="form-group">
      <label>Personalize seu Avatar</label>
      <div id="editAvatarBuilder"></div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" id="confirmEditProfile">Salvar</button>
  `);

  renderAvatarOptions('editAvatarBuilder', editAvatarConfig, (cfg) => { editAvatarConfig = cfg; });

  document.getElementById('confirmEditProfile').addEventListener('click', async () => {
    const nome = document.getElementById('editNome').value.trim();

    if (!nome) {
      showToast('Nome é obrigatório', 'warning');
      return;
    }

    try {
      const fotoPerfil = editAvatarConfig ? JSON.stringify(editAvatarConfig) : null;
      const updated = await atualizarUsuario(user.id, {
        id: user.id,
        nome,
        fotoPerfil,
        email: user.email,
      });

      const currentUser = getUser();
      saveAuth(getToken(), { ...currentUser, nome: updated.nome, fotoPerfil: updated.fotoPerfil });
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
