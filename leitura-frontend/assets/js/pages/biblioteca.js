let allBooks = [];
let activeGenre = null;
let currentSort = 'recent';
let searchTerm = '';

function renderBooks(books) {
  const grid = document.getElementById('bookGrid');
  const empty = document.getElementById('emptyState');

  if (books.length === 0) {
    grid.innerHTML = '';
    showEmptyState();
    return;
  }

  empty.classList.add('hidden');
  grid.innerHTML = books.map((book, idx) => {
    const progress = book.progresso || 0;
    const hasImage = book.urlCapa || book.capaUrl;
    const imageUrl = book.urlCapa || book.capaUrl || '';
    const rating = book.avaliacaoMed || book.avaliacaoMedia;
    return `
    <a href="livro-detalhes.html?id=${book.id}" class="book-card" style="animation-delay:${idx * 0.04}s">
      <div class="book-card-cover">
        ${hasImage ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(book.titulo)}" loading="lazy" onerror="this.onerror=null;this.src='../assets/img/placeholder-book.svg'">` : `<div class="cover-icon-bg">&#128218;</div>`}
        <div class="cover-overlay"></div>
        <span class="cover-title">${escapeHtml(book.titulo)}</span>
        <span class="cover-author">${escapeHtml(book.autor)}</span>
        ${book.genero ? `<span class="cover-genre-badge">${escapeHtml(book.genero)}</span>` : ''}
        <button class="cover-bookmark" onclick="event.stopPropagation();event.preventDefault()" title="Adicionar aos favoritos">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z"/></svg>
        </button>
        ${progress > 0 ? `<div class="cover-progress"><div class="cover-progress-bar" style="width:${Math.min(100, progress)}%"></div></div>` : ''}
      </div>
      <div class="book-card-body">
        <h3>${escapeHtml(book.titulo)}</h3>
        <p class="author">${escapeHtml(book.autor)}</p>
        ${rating ? `<div>${renderSvgStars(rating, 12)}</div>` : ''}
        ${book.genero ? `<span class="genre-tag">${escapeHtml(book.genero)}</span>` : ''}
      </div>
    </a>`;
  }).join('');
}

function showEmptyState() {
  const empty = document.getElementById('emptyState');
  const message = document.getElementById('emptyMessage');
  const resetBtn = document.getElementById('emptyResetBtn');

  const hasFilters = activeGenre || searchTerm;

  if (hasFilters) {
    message.textContent = 'Nenhum livro corresponde aos filtros aplicados. Tente ajustar sua busca ou limpar os filtros.';
    resetBtn.classList.remove('hidden');
  } else {
    message.textContent = 'Ainda não há livros cadastrados na biblioteca.';
    resetBtn.classList.add('hidden');
  }

  empty.classList.remove('hidden');
}

function extractGenres(books) {
  const seen = new Set();
  const genres = [];
  for (const b of books) {
    if (b.genero && !seen.has(b.genero)) {
      seen.add(b.genero);
      genres.push(b.genero);
    }
  }
  return genres.sort();
}

function renderGenreFilters(books) {
  const container = document.getElementById('genreFilters');
  const genres = extractGenres(books);

  if (genres.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = genres.map(g => {
    const count = books.filter(b => b.genero === g).length;
    const active = activeGenre === g ? 'active' : '';
    return `<button class="genre-chip ${active}" data-genre="${escapeHtml(g)}">${escapeHtml(g)} <span class="chip-count">${count}</span></button>`;
  }).join('');
}

function updateStats(books) {
  const statsBar = document.getElementById('statsBar');
  const statsText = document.getElementById('statsText');
  const clearBtn = document.getElementById('clearFilters');

  const hasFilters = activeGenre || searchTerm;
  const total = allBooks.length;
  const shown = books.length;

  if (hasFilters) {
    statsText.textContent = `${shown} de ${total} livro${total !== 1 ? 's' : ''} encontrado${shown !== 1 ? 's' : ''}`;
    clearBtn.classList.remove('hidden');
    statsBar.classList.remove('hidden');
  } else if (total > 0) {
    statsText.textContent = `${total} livro${total !== 1 ? 's' : ''} na biblioteca`;
    clearBtn.classList.add('hidden');
    statsBar.classList.remove('hidden');
  } else {
    statsBar.classList.add('hidden');
  }
}

function applyFiltersAndSort() {
  let filtered = [...allBooks];

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(b =>
      (b.titulo && b.titulo.toLowerCase().includes(term)) ||
      (b.autor && b.autor.toLowerCase().includes(term)) ||
      (b.genero && b.genero.toLowerCase().includes(term))
    );
  }

  if (activeGenre) {
    filtered = filtered.filter(b => b.genero === activeGenre);
  }

  switch (currentSort) {
    case 'title':
      filtered.sort((a, b) => (a.titulo || '').localeCompare(b.titulo || '', 'pt-BR'));
      break;
    case 'author':
      filtered.sort((a, b) => (a.autor || '').localeCompare(b.autor || '', 'pt-BR'));
      break;
    case 'rating': {
      filtered.sort((a, b) => {
        const ra = a.avaliacaoMed || a.avaliacaoMedia || 0;
        const rb = b.avaliacaoMed || b.avaliacaoMedia || 0;
        return rb - ra;
      });
      break;
    }
    case 'recent':
    default:
      filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
      break;
  }

  renderBooks(filtered);
  updateStats(filtered);
  renderGenreFilters(allBooks);
}

async function loadBooks(params = {}) {
  const loading = document.getElementById('loading');
  const grid = document.getElementById('bookGrid');

  loading.classList.remove('hidden');
  grid.innerHTML = '';

  try {
    const books = await listarLivros(params);
    allBooks = books;
    applyFiltersAndSort();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    loading.classList.add('hidden');
  }
}

function clearAllFilters() {
  activeGenre = null;
  searchTerm = '';
  currentSort = 'recent';

  document.getElementById('searchInput').value = '';
  document.getElementById('searchClear').classList.remove('visible');
  document.getElementById('sortSelect').value = 'recent';

  applyFiltersAndSort();
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderNavbar('biblioteca.html');
  loadBooks();

  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  const sortSelect = document.getElementById('sortSelect');
  const clearFiltersBtn = document.getElementById('clearFilters');
  const emptyResetBtn = document.getElementById('emptyResetBtn');

  searchInput.addEventListener('input', debounce(function() {
    searchTerm = this.value.trim();
    searchClear.classList.toggle('visible', searchTerm.length > 0);
    applyFiltersAndSort();
  }, 300));

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchTerm = '';
    searchClear.classList.remove('visible');
    applyFiltersAndSort();
    searchInput.focus();
  });

  sortSelect.addEventListener('change', () => {
    currentSort = sortSelect.value;
    applyFiltersAndSort();
  });

  document.getElementById('genreFilters').addEventListener('click', (e) => {
    const chip = e.target.closest('.genre-chip');
    if (!chip) return;
    const genre = chip.dataset.genre;
    activeGenre = activeGenre === genre ? null : genre;
    applyFiltersAndSort();
  });

  clearFiltersBtn.addEventListener('click', clearAllFilters);
  emptyResetBtn.addEventListener('click', clearAllFilters);
});
