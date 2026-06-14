let livroId = null;
let currentUser = null;

async function loadBook() {
  const params = new URLSearchParams(window.location.search);
  livroId = parseInt(params.get('id'));
  if (!livroId) {
    showToast('ID do livro não informado', 'error');
    return;
  }

  currentUser = getUser();
  const loading = document.getElementById('loading');
  const detail = document.getElementById('bookDetail');

  loading.classList.remove('hidden');
  detail.classList.add('hidden');

  try {
    const [livro, leituras] = await Promise.all([
      buscarLivro(livroId),
      listarLeituras(currentUser.id),
    ]);

    document.getElementById('bookTitle').textContent = livro.titulo;
    document.getElementById('bookAuthor').textContent = livro.autor;
    document.getElementById('bookGenre').textContent = livro.genero || '';
    document.getElementById('bookYear').textContent = livro.dataPublicacao ? `Publicado em ${formatDate(livro.dataPublicacao)}` : '';
    document.getElementById('bookDescription').textContent = livro.descricao || 'Sem descrição disponível.';

    const userLeitura = leituras.find(l => l.idLivro === livroId);
    if (userLeitura) {
      document.getElementById('statusSelect').value = userLeitura.status;
    }

    detail.classList.remove('hidden');
    loadReviews();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    loading.classList.add('hidden');
  }
}

async function loadReviews() {
  const container = document.getElementById('reviewsList');

  try {
    const resenhas = await listarResenhas(livroId);

    if (resenhas.length === 0) {
      container.innerHTML = '<p class="text-muted">Nenhuma resenha ainda. Seja o primeiro!</p>';
      return;
    }

    container.innerHTML = resenhas.map(r => `
      <div class="review-item">
        <div class="review-header">
          <span class="review-author">${escapeHtml(r.nomeUsuario)}</span>
          ${r.nota ? `<span class="review-nota">${r.nota}/5</span>` : ''}
        </div>
        <p class="review-text">${escapeHtml(r.texto)}</p>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p class="text-muted">Erro ao carregar resenhas.</p>';
  }
}

async function handleSaveStatus() {
  const status = document.getElementById('statusSelect').value;
  if (!status) {
    showToast('Selecione um status', 'warning');
    return;
  }

  try {
    const leituras = await listarLeituras(currentUser.id);
    const existing = leituras.find(l => l.idLivro === livroId);

    if (existing) {
      await atualizarLeitura(existing.id, { status });
    } else {
      await registrarLeitura({
        idUsuario: currentUser.id,
        idLivro: livroId,
        status,
      });
    }

    showToast('Status atualizado!', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function handleSubmitReview() {
  const texto = document.getElementById('reviewText').value.trim();
  const nota = parseFloat(document.getElementById('reviewNota').value);

  if (!texto) {
    showToast('Escreva sua resenha', 'warning');
    return;
  }

  try {
    await criarResenha({
      idUsuario: currentUser.id,
      idLivro: livroId,
      texto,
      nota: isNaN(nota) ? null : nota,
    });

    document.getElementById('reviewText').value = '';
    document.getElementById('reviewNota').value = '';
    showToast('Resenha publicada!', 'success');
    loadReviews();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderNavbar('biblioteca.html');
  loadBook();

  document.getElementById('saveStatusBtn').addEventListener('click', handleSaveStatus);
  document.getElementById('submitReviewBtn').addEventListener('click', handleSubmitReview);
});
