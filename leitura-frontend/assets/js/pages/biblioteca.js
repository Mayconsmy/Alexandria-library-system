let allBooks = [];

function renderBooks(books) {
  const grid = document.getElementById('bookGrid');
  const empty = document.getElementById('emptyState');

  if (books.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  grid.innerHTML = books.map(book => `
    <a href="livro-detalhes.html?id=${book.id}" class="book-card">
      <div class="book-card-cover">
        <img src="../assets/img/placeholder-book.svg" alt="${escapeHtml(book.titulo)}">
      </div>
      <div class="book-card-body">
        <h3>${escapeHtml(book.titulo)}</h3>
        <p class="author">${escapeHtml(book.autor)}</p>
        ${book.genero ? `<p class="genre">${escapeHtml(book.genero)}</p>` : ''}
      </div>
    </a>
  `).join('');
}

async function loadBooks(params = {}) {
  const loading = document.getElementById('loading');
  const grid = document.getElementById('bookGrid');

  loading.classList.remove('hidden');
  grid.innerHTML = '';

  try {
    const books = await listarLivros(params);
    allBooks = books;
    renderBooks(books);
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    loading.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderNavbar('biblioteca.html');
  loadBooks();

  document.getElementById('searchBtn').addEventListener('click', () => {
    const term = document.getElementById('searchInput').value.trim();
    loadBooks(term ? { titulo: term } : {});
  });

  document.getElementById('searchInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('searchBtn').click();
    }
  });
});
