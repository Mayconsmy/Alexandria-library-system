let livroId = null;
let currentUser = null;
let reviewsData = [];

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
    const [livro, leitura] = await Promise.all([
      buscarLivro(livroId),
      buscarLeituraPorUsuarioELivro(currentUser.id, livroId),
    ]);

    document.getElementById('bookTitle').textContent = livro.titulo;
    document.getElementById('bookAuthor').textContent = livro.autor;
    document.getElementById('bookGenre').textContent = livro.genero || '';
    document.getElementById('bookYear').textContent = livro.dataPublicacao ? `Publicado em ${formatDate(livro.dataPublicacao)}` : '';
    document.getElementById('bookDescription').textContent = livro.descricao || 'Sem descrição disponível.';

    if (leitura) {
      highlightStatus(leitura.status);
    }

    detail.classList.remove('hidden');
    loadReviews();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    loading.classList.add('hidden');
  }
}

function renderStars(rating, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = renderSvgStars(rating, 28);
}

function renderReviewsList() {
  const container = document.getElementById('reviewsList');

  if (reviewsData.length === 0) {
    container.innerHTML = '<div class="reviews-empty"><p class="text-muted">Nenhuma resenha ainda. Seja o primeiro a compartilhar sua opinião!</p></div>';
    return;
  }

  const notas = reviewsData.filter(r => r.nota != null).map(r => r.nota);
  const media = notas.length > 0 ? notas.reduce((sum, n) => sum + n, 0) / notas.length : 0;
  renderStars(media, 'avgStars');
  document.getElementById('avgRatingText').textContent = `${media.toFixed(1)} / 5 (${reviewsData.length} avaliação${reviewsData.length !== 1 ? 'ões' : ''})`;

  container.innerHTML = reviewsData.map((r, idx) => {
    const stars = r.nota ? renderSvgStars(r.nota, 14) : '';
    const avatarConfig = getAvatarConfig(r.fotoPerfil);
    const avatarHTML = avatarConfig
      ? renderAvatarSVG(avatarConfig, 36)
      : `<span>${escapeHtml((r.nomeUsuario || '?')[0].toUpperCase())}</span>`;

    const canEdit = currentUser && r.idUsuario === currentUser.id;

    return `
      <div class="review-item glass" style="animation-delay:${idx * 0.04}s">
        <div class="review-item-header">
          <div class="review-item-user">
            <div class="review-item-avatar">${avatarHTML}</div>
            <div>
              <strong class="review-item-name">${escapeHtml(r.nomeUsuario)}</strong>
              <span class="review-item-date">${formatDate(r.data)}</span>
            </div>
          </div>
          ${stars}
        </div>
        <p class="review-item-text">${escapeHtml(r.texto)}</p>
        ${canEdit ? `
          <div class="review-item-actions">
            <button class="btn btn-sm btn-secondary" onclick="showEditReviewModal(${r.id})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="handleDeleteReview(${r.id})">Excluir</button>
          </div>` : ''}
      </div>`;
  }).join('');
}

async function loadReviews() {
  try {
    const resenhas = await listarResenhas(livroId) || [];
    reviewsData = resenhas;
    renderReviewsList();
  } catch (err) {
    document.getElementById('reviewsList').innerHTML = '<p class="text-muted">Erro ao carregar resenhas.</p>';
  }
}

function highlightStatus(status) {
  document.querySelectorAll('.btn-status').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.status === status);
  });
}

async function handleQuickStatus(status) {
  if (!livroId || !currentUser) return;
  try {
    const leitura = await buscarLeituraPorUsuarioELivro(currentUser.id, livroId);
    if (leitura) {
      await atualizarLeitura(leitura.id, { status });
    } else {
      await registrarLeitura({ idUsuario: currentUser.id, idLivro: livroId, status });
    }
    highlightStatus(status);
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

  if (isNaN(nota) || nota < 1 || nota > 5) {
    showToast('Avaliação deve ser entre 1 e 5 estrelas', 'warning');
    return;
  }

  try {
    await criarResenha({
      idUsuario: currentUser.id,
      idLivro: livroId,
      texto,
      nota,
    });

    document.getElementById('reviewText').value = '';
    document.getElementById('reviewNota').value = '';
    showToast('Resenha publicada!', 'success');
    loadReviews();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function showEditReviewModal(reviewId) {
  const review = reviewsData.find(r => r.id === reviewId);
  if (!review) return;

  const starPickerHtml = [1, 2, 3, 4, 5].map(n => `
    <span class="star-picker-star ${n <= (review.nota || 0) ? 'active' : ''}"
          data-value="${n}" onclick="selectEditStar(this)">&#9733;</span>
  `).join('');

  openModal('Editar Resenha', `
    <div class="form-group">
      <label>Avaliação</label>
      <div class="star-picker" id="editStarPicker" data-selected="${review.nota || 0}">${starPickerHtml}</div>
    </div>
    <div class="form-group">
      <label>Texto</label>
      <textarea id="editReviewText" rows="4" autofocus>${escapeHtml(review.texto)}</textarea>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" id="confirmEditReview">Salvar</button>
  `);

  document.getElementById('confirmEditReview').addEventListener('click', async () => {
    const texto = document.getElementById('editReviewText').value.trim();
    const picker = document.getElementById('editStarPicker');
    const nota = parseInt(picker.dataset.selected) || 0;

    if (!texto) {
      showToast('Escreva sua resenha', 'warning');
      return;
    }

    try {
      const updated = await atualizarResenha(reviewId, {
        idUsuario: currentUser.id,
        idLivro: review.idLivro,
        texto,
        nota,
      });
      closeModal();
      const idx = reviewsData.findIndex(r => r.id === reviewId);
      if (idx !== -1) reviewsData[idx] = updated;
      showToast('Resenha atualizada!', 'success');
      renderReviewsList();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

async function handleDeleteReview(reviewId) {
  if (!confirm('Tem certeza que deseja excluir esta resenha?')) return;
  try {
    await deletarResenha(reviewId);
    reviewsData = reviewsData.filter(r => r.id !== reviewId);
    showToast('Resenha excluída!', 'success');
    renderReviewsList();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

window.selectEditStar = function (el) {
  const picker = el.parentElement;
  const value = parseInt(el.dataset.value);
  picker.dataset.selected = value;
  picker.querySelectorAll('.star-picker-star').forEach(span => {
    span.classList.toggle('active', parseInt(span.dataset.value) <= value);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderNavbar('biblioteca.html');
  loadBook();

  document.querySelectorAll('.btn-status').forEach(btn => {
    btn.addEventListener('click', () => handleQuickStatus(btn.dataset.status));
  });
  document.getElementById('submitReviewBtn').addEventListener('click', handleSubmitReview);
});
