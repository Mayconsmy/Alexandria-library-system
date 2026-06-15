let userGroups = [];

function renderGroups(groups) {
  const grid = document.getElementById('groupGrid');
  const empty = document.getElementById('emptyState');
  const groupList = groups || [];

  if (groupList.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  grid.innerHTML = groupList.map((g, idx) => {
    const isMember = userGroups.some(ug => ug.id === g.id);
    return `
      <a href="grupo-detalhes.html?id=${g.id}" class="group-card" style="animation-delay:${idx * 0.04}s">
        <div class="group-card-cover">
          <div class="group-card-cover-bg"></div>
          <div class="group-card-cover-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
        </div>
        <div class="group-card-body">
          <h3>${escapeHtml(g.nome)}</h3>
          <p class="group-desc">${escapeHtml(g.descricao || 'Sem descrição')}</p>
          <div class="group-meta">
            <span class="group-meta-item">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              ${escapeHtml(g.adminNome)}
            </span>
            <span class="group-meta-item">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              ${g.qtdMembros} membro${g.qtdMembros !== 1 ? 's' : ''}
            </span>
            <span class="group-badge ${g.privado ? 'group-badge-private' : 'group-badge-public'}">${g.privado ? 'Privado' : 'Público'}</span>
            ${isMember ? '<span class="group-member-badge">Membro</span>' : ''}
          </div>
        </div>
      </a>`;
  }).join('');
}

async function loadGroups(params = {}) {
  const loading = document.getElementById('loading');
  const grid = document.getElementById('groupGrid');
  const user = getUser();

  loading.classList.remove('hidden');
  grid.innerHTML = '';

  try {
    const [groups, userGrp] = await Promise.all([
      listarGrupos(params),
      listarGruposPorUsuario(user.id).catch(() => []),
    ]);
    userGroups = userGrp;
    renderGroups(groups);
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    loading.classList.add('hidden');
  }
}

function showCreateGroupModal() {
  const user = getUser();
  openModal('Criar Grupo', `
    <div class="form-group">
      <label>Nome do Grupo</label>
      <input type="text" id="groupNameInput" placeholder="Ex: Clássicos Brasileiros" required>
    </div>
    <div class="form-group">
      <label>Descrição</label>
      <textarea id="groupDescInput" placeholder="Descreva o propósito do grupo..." rows="3"></textarea>
    </div>
    <div class="form-group">
      <label>
        <input type="checkbox" id="groupPrivateInput"> Grupo privado
      </label>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" id="confirmCreateGroup">Criar</button>
  `);

  document.getElementById('confirmCreateGroup').addEventListener('click', async () => {
    const nome = document.getElementById('groupNameInput').value.trim();
    const descricao = document.getElementById('groupDescInput').value.trim();
    const privado = document.getElementById('groupPrivateInput').checked;

    if (!nome) {
      showToast('Nome é obrigatório', 'warning');
      return;
    }

    try {
      await criarGrupo({
        idAdmin: user.id,
        nome,
        descricao,
        privado,
      });
      closeModal();
      showToast('Grupo criado com sucesso!', 'success');
      loadGroups();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderNavbar('grupos.html');
  loadGroups();

  document.getElementById('createGroupBtn').addEventListener('click', showCreateGroupModal);

  document.getElementById('searchInput').addEventListener('input', debounce(function() {
    const term = this.value.trim();
    loadGroups(term ? { nome: term } : {});
  }, 300));
});
