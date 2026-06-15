function getMaxYear() {
  const currentYear = new Date().getFullYear();
  return currentYear + 150;
}

function getMinDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function getMaxDate() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 150);
  return d.toISOString().split('T')[0];
}

function renderMetaSummary(metas) {
  const summary = document.getElementById('metasSummary');
  const total = metas.length;
  const active = metas.filter(m => m.progresso < m.quantidadeLivros).length;
  const complete = total - active;

  document.getElementById('summaryTotal').textContent = total;
  document.getElementById('summaryActive').textContent = active;
  document.getElementById('summaryComplete').textContent = complete;
  summary.classList.remove('hidden');
}

function buildMetaCard(m) {
  const pct = m.quantidadeLivros > 0
    ? Math.min(Math.round((m.progresso / m.quantidadeLivros) * 100), 100)
    : 0;
  const complete = pct >= 100;

  return `
    <div class="meta-card${complete ? ' complete' : ''}">
      <div class="meta-card-top">
        <div class="meta-card-title-group">
          <div class="meta-card-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
          <div class="meta-card-info">
            <h3>${m.quantidadeLivros} livro${m.quantidadeLivros !== 1 ? 's' : ''}</h3>
            <span class="meta-card-prazo">Prazo: ${formatDate2(m.prazo)}</span>
          </div>
        </div>
        <div class="meta-actions">
          <button class="btn btn-sm btn-secondary" onclick="showEditMetaModal(${m.id}, ${m.quantidadeLivros}, '${m.prazo}')">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="14" height="14" style="vertical-align:middle;margin-right:4px"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar
          </button>
          <button class="btn btn-sm btn-danger" onclick="showDeleteMetaModal(${m.id})">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="14" height="14" style="vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
            Excluir
          </button>
        </div>
      </div>
      <div class="meta-card-progress">
        <div class="meta-progress-header">
          <span>Progresso: ${m.progresso}/${m.quantidadeLivros}</span>
          <span class="meta-progress-pct">${pct}%</span>
        </div>
        <div class="meta-progress-bar">
          <div class="meta-progress-fill" style="width:${pct}%"></div>
        </div>
        ${complete ? '<span class="meta-complete-badge"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Meta concluída!</span>' : ''}
      </div>
    </div>`;
}

async function loadMetas() {
  const user = getUser();
  const loading = document.getElementById('loading');
  const list = document.getElementById('metaList');
  const empty = document.getElementById('emptyState');

  loading.classList.remove('hidden');
  list.innerHTML = '';
  empty.classList.add('hidden');

  try {
    const metas = await listarMetas(user.id) || [];

    if (metas.length === 0) {
      empty.classList.remove('hidden');
      return;
    }

    renderMetaSummary(metas);
    list.innerHTML = metas.map(buildMetaCard).join('');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    loading.classList.add('hidden');
  }
}

function showCreateMetaModal() {
  const user = getUser();

  openModal('Nova Meta', `
    <div class="form-group">
      <label>Quantidade de livros</label>
      <input type="number" id="metaQtdInput" placeholder="Ex: 12" min="1" required>
    </div>
    <div class="form-group">
      <label>Prazo</label>
      <input type="date" id="metaPrazoInput" min="${getMinDate()}" max="${getMaxDate()}" required>
      <span class="text-muted" style="font-size:12px;">Ano mínimo: ${new Date().getFullYear()} | Ano máximo: ${getMaxYear()}</span>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" id="confirmCreateMeta">Criar</button>
  `);

  document.getElementById('confirmCreateMeta').addEventListener('click', async () => {
    const qtd = parseInt(document.getElementById('metaQtdInput').value);
    const prazo = document.getElementById('metaPrazoInput').value;

    if (!qtd || qtd < 1) {
      showToast('Quantidade inválida', 'warning');
      return;
    }
    if (!prazo) {
      showToast('Selecione um prazo', 'warning');
      return;
    }

    const prazoDate = new Date(prazo);
    const maxDate = new Date(getMaxDate());
    if (prazoDate > maxDate) {
      showToast('Prazo máximo é ' + getMaxYear(), 'warning');
      return;
    }

    try {
      await criarMeta({
        idUsuario: user.id,
        quantidadeLivros: qtd,
        prazo: prazo,
      });
      closeModal();
      showToast('Meta criada com sucesso!', 'success');
      loadMetas();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

function showEditMetaModal(id, qtdAtual, prazoAtual) {
  const user = getUser();

  openModal('Editar Meta', `
    <div class="form-group">
      <label>Quantidade de livros</label>
      <input type="number" id="editMetaQtd" value="${qtdAtual}" min="1" required>
    </div>
    <div class="form-group">
      <label>Prazo</label>
      <input type="date" id="editMetaPrazo" value="${prazoAtual}" min="${getMinDate()}" max="${getMaxDate()}" required>
      <span class="text-muted" style="font-size:12px;">Ano mínimo: ${new Date().getFullYear()} | Ano máximo: ${getMaxYear()}</span>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" id="confirmEditMeta">Salvar</button>
  `);

  document.getElementById('confirmEditMeta').addEventListener('click', async () => {
    const qtd = parseInt(document.getElementById('editMetaQtd').value);
    const prazo = document.getElementById('editMetaPrazo').value;

    if (!qtd || qtd < 1) {
      showToast('Quantidade inválida', 'warning');
      return;
    }
    if (!prazo) {
      showToast('Selecione um prazo', 'warning');
      return;
    }

    try {
      await atualizarMeta(id, {
        idUsuario: user.id,
        quantidadeLivros: qtd,
        prazo: prazo,
      });
      closeModal();
      showToast('Meta atualizada!', 'success');
      loadMetas();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

function showDeleteMetaModal(id) {
  openModal('Excluir Meta', `
    <p>Tem certeza que deseja excluir esta meta?</p>
    <p class="text-muted">Esta ação não pode ser desfeita.</p>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-danger" id="confirmDeleteMeta">Excluir</button>
  `);

  document.getElementById('confirmDeleteMeta').addEventListener('click', async () => {
    try {
      await deletarMeta(id);
      closeModal();
      showToast('Meta excluída!', 'success');
      loadMetas();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderNavbar('metas.html');
  loadMetas();

  document.getElementById('createMetaBtn').addEventListener('click', showCreateMetaModal);
  document.getElementById('emptyCreateBtn').addEventListener('click', showCreateMetaModal);
});
