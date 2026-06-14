function renderGroups(groups) {
  const grid = document.getElementById('groupGrid');
  const empty = document.getElementById('emptyState');

  if (groups.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  grid.innerHTML = groups.map(g => `
    <a href="grupo-detalhes.html?id=${g.id}" class="group-card">
      <h3>${escapeHtml(g.nome)}</h3>
      <p class="description">${escapeHtml(g.descricao || 'Sem descrição')}</p>
      <div class="meta">
        <span>👤 ${escapeHtml(g.adminNome)}</span>
        <span>👥 ${g.qtdMembros} membro${g.qtdMembros !== 1 ? 's' : ''}</span>
        ${g.privado ? '<span>🔒 Privado</span>' : '<span>🌍 Público</span>'}
      </div>
    </a>
  `).join('');
}

async function loadGroups(params = {}) {
  const loading = document.getElementById('loading');
  const grid = document.getElementById('groupGrid');

  loading.classList.remove('hidden');
  grid.innerHTML = '';

  try {
    const groups = await listarGrupos(params);
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

  document.getElementById('searchBtn').addEventListener('click', () => {
    const term = document.getElementById('searchInput').value.trim();
    loadGroups(term ? { nome: term } : {});
  });

  document.getElementById('searchInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') document.getElementById('searchBtn').click();
  });
});
