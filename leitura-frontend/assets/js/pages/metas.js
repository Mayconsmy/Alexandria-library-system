async function loadMetas() {
  const user = getUser();
  const loading = document.getElementById('loading');
  const list = document.getElementById('metaList');
  const empty = document.getElementById('emptyState');

  loading.classList.remove('hidden');
  list.innerHTML = '';
  empty.classList.add('hidden');

  try {
    const metas = await listarMetas(user.id);

    if (metas.length === 0) {
      empty.classList.remove('hidden');
      return;
    }

    list.innerHTML = metas.map(m => {
      const pct = m.quantidadeLivros > 0
        ? Math.min(Math.round((m.progresso / m.quantidadeLivros) * 100), 100)
        : 0;
      const complete = pct >= 100;

      return `
        <div class="meta-card">
          <div class="meta-header">
            <h3>${m.quantidadeLivros} livro${m.quantidadeLivros !== 1 ? 's' : ''}</h3>
            <span class="meta-prazo">Prazo: ${formatDateTime(m.prazo)}</span>
          </div>
          <div class="meta-progress-info">
            <span>Progresso: ${m.progresso}/${m.quantidadeLivros}</span>
            <span>${pct}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill ${complete ? 'complete' : ''}" style="width:${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
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
      <input type="datetime-local" id="metaPrazoInput" required>
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

    try {
      await criarMeta({
        idUsuario: user.id,
        quantidadeLivros: qtd,
        prazo: new Date(prazo).toISOString(),
      });
      closeModal();
      showToast('Meta criada com sucesso!', 'success');
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
});
