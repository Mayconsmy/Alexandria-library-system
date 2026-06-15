let allReviews = [];
let booksCache = {};

async function fetchBooksForReviews(reviews) {
  const uniqueIds = [...new Set(reviews.map(r => r.idLivro))];
  const missing = uniqueIds.filter(id => !booksCache[id]);
  if (missing.length === 0) return;
  const results = await Promise.allSettled(missing.map(id => buscarLivro(id)));
  results.forEach((res, i) => {
    if (res.status === 'fulfilled') {
      booksCache[missing[i]] = res.value;
    }
  });
}

function populateGenreFilter() {
  const select = document.getElementById('genreFilter');
  const genres = new Set();
  Object.values(booksCache).forEach(b => {
    if (b.genero) genres.add(b.genero);
  });
  const current = select.value;
  select.innerHTML = '<option value="">Todos os gêneros</option>' +
    [...genres].sort().map(g => `<option value="${escapeHtml(g)}">${escapeHtml(g)}</option>`).join('');
  select.value = current;
}

function renderHeroStats(reviews) {
  const total = reviews.length;
  const notas = reviews.filter(r => r.nota != null).map(r => r.nota);
  const avg = notas.length > 0 ? notas.reduce((sum, n) => sum + n, 0) / notas.length : 0;
  const reacoes = reviews.reduce((sum, r) => sum + (r.qtdReacoes || 0), 0);

  document.getElementById('heroTotalResenhas').textContent = total;
  document.getElementById('heroAvgRating').innerHTML = total > 0 ? renderSvgStars(Math.round(avg * 2) / 2, 18) : '—';
  document.getElementById('heroTotalReacoes').textContent = reacoes;
}

function renderReviews(reviews) {
  const grid = document.getElementById('reviewsGrid');
  const empty = document.getElementById('emptyState');
  const currentUserId = getUser().id;

  if (reviews.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  grid.innerHTML = reviews.map((r, idx) => {
    const book = booksCache[r.idLivro];
    const autor = book ? escapeHtml(book.autor || '') : '';
    const genero = book ? escapeHtml(book.genero || '') : '';
    const avatarConfig = getAvatarConfig(r.fotoPerfil);
    const avatarHTML = avatarConfig
      ? renderAvatarSVG(avatarConfig, 40)
      : `<span>${escapeHtml((r.nomeUsuario || '?')[0].toUpperCase())}</span>`;
    const hasImage = book && (book.urlCapa || book.capaUrl);
    const imageUrl = book ? (book.urlCapa || book.capaUrl || '') : '';
    const canEdit = r.idUsuario === currentUserId;

    return `
      <div class="review-card glass" style="animation-delay:${idx * 0.03}s">
        <div class="review-card-top">
          <div class="review-card-avatar">${avatarHTML}</div>
          <div class="review-card-meta">
            <a href="livro-detalhes.html?id=${r.idLivro}" class="review-card-book">${escapeHtml(r.tituloLivro)}</a>
            ${autor ? `<span class="review-card-author">${autor}</span>` : ''}
            <span class="review-card-user">${escapeHtml(r.nomeUsuario)}</span>
          </div>
          <div class="review-card-cover-thumb">
            ${hasImage ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(r.tituloLivro)}" loading="lazy" onerror="this.onerror=null;this.src='../assets/img/placeholder-book.svg'">` : `<div class="cover-thumb-fallback">&#128218;</div>`}
          </div>
        </div>
        ${r.nota ? `<div class="review-card-stars">${renderSvgStars(r.nota, 14)}</div>` : ''}
        <p class="review-card-text">${r.texto ? escapeHtml(r.texto.substring(0, 320)) : ''}${r.texto && r.texto.length > 320 ? '...' : ''}</p>
        <div class="review-card-footer">
          ${canEdit ? `
            <div class="review-card-actions">
              <button class="btn btn-sm btn-secondary" onclick="showGlobalEditReviewModal(${r.id})">Editar</button>
              <button class="btn btn-sm btn-danger" onclick="handleGlobalDeleteReview(${r.id})">Excluir</button>
            </div>
          ` : ''}
          <span>${formatDate(r.data)}</span>
          <div class="review-card-footer-right">
            ${genero ? `<span class="review-card-genre">${genero}</span>` : ''}
            ${r.qtdReacoes > 0 ? `
              <span class="review-card-reactions">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                ${r.qtdReacoes}
              </span>
            ` : ''}
          </div>
        </div>
      </div>`;
  }).join('');
}

function showGlobalEditReviewModal(reviewId) {
  const review = allReviews.find(r => r.id === reviewId);
  if (!review) return;
  const user = getUser();

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
      <textarea id="editReviewText" rows="4">${escapeHtml(review.texto)}</textarea>
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
        idUsuario: user.id,
        idLivro: review.idLivro,
        texto,
        nota,
      });
      closeModal();
      const idx = allReviews.findIndex(r => r.id === reviewId);
      if (idx !== -1) allReviews[idx] = updated;
      showToast('Resenha atualizada!', 'success');
      applyClientFilters();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

async function handleGlobalDeleteReview(reviewId) {
  if (!confirm('Tem certeza que deseja excluir esta resenha?')) return;
  try {
    await deletarResenha(reviewId);
    allReviews = allReviews.filter(r => r.id !== reviewId);
    showToast('Resenha excluída!', 'success');
    applyClientFilters();
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

function applyClientFilters() {
  const busca = document.getElementById('searchInput').value.trim().toLowerCase();
  const estrelas = document.getElementById('starsFilter').value;
  const genreVal = document.getElementById('genreFilter').value;
  const dateDays = document.getElementById('dateFilter').value;

  let filtered = allReviews;

  if (busca) {
    filtered = filtered.filter(r => {
      const book = booksCache[r.idLivro];
      const inTitulo = r.tituloLivro.toLowerCase().includes(busca);
      const inAutor = book && book.autor && book.autor.toLowerCase().includes(busca);
      const inTexto = r.texto && r.texto.toLowerCase().includes(busca);
      const inGenero = book && book.genero && book.genero.toLowerCase().includes(busca);
      const inUsuario = r.nomeUsuario.toLowerCase().includes(busca);
      return inTitulo || inAutor || inTexto || inGenero || inUsuario;
    });
  }

  if (estrelas) {
    const target = parseInt(estrelas);
    filtered = filtered.filter(r => r.nota != null && Math.round(r.nota) === target);
  }

  if (genreVal) {
    filtered = filtered.filter(r => {
      const book = booksCache[r.idLivro];
      return book && book.genero === genreVal;
    });
  }

  if (dateDays) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - parseInt(dateDays));
    filtered = filtered.filter(r => {
      if (!r.data) return false;
      const d = new Date(r.data + 'T00:00:00');
      return d >= cutoff;
    });
  }

  renderReviews(filtered);
  renderHeroStats(filtered);
}

async function loadReviews(params = {}) {
  const user = getUser();
  const loading = document.getElementById('loading');
  const grid = document.getElementById('reviewsGrid');

  loading.classList.remove('hidden');
  grid.innerHTML = '';

  try {
    const reviews = await listarResenhasPorUsuario(user.id, params) || [];
    allReviews = reviews;
    await fetchBooksForReviews(reviews);
    populateGenreFilter();
    applyClientFilters();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    loading.classList.add('hidden');
  }
}

function handleFilterChange() {
  applyClientFilters();
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderNavbar('resenhas.html');

  const user = getUser();
  document.getElementById('heroName').textContent = user.nome;

  loadReviews();

  document.getElementById('searchInput').addEventListener('input', debounce(handleFilterChange, 400));
  document.getElementById('starsFilter').addEventListener('change', handleFilterChange);
  document.getElementById('genreFilter').addEventListener('change', handleFilterChange);
  document.getElementById('dateFilter').addEventListener('change', handleFilterChange);
});
