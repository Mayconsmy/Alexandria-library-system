const STATUS_SECTIONS = [
  {
    status: 'lendo',
    sectionId: 'sectionLendo',
    gridId: 'lendoGrid',
    emptyId: 'emptyLendo',
    countId: 'countLendo',
    title: 'Estou Lendo',
    icon: 'book',
  },
  {
    status: 'relendo',
    sectionId: 'sectionRelendo',
    gridId: 'relendoGrid',
    emptyId: 'emptyRelendo',
    countId: 'countRelendo',
    title: 'Relendo',
    icon: 'refresh',
  },
  {
    status: 'lido',
    sectionId: 'sectionLido',
    gridId: 'lidoGrid',
    emptyId: 'emptyLido',
    countId: 'countLido',
    title: 'Já Li',
    icon: 'check',
  },
  {
    status: 'quero_ler',
    sectionId: 'sectionQueroLer',
    gridId: 'queroLerGrid',
    emptyId: 'emptyQueroLer',
    countId: 'countQueroLer',
    title: 'Quero Ler',
    icon: 'plus',
  },
  {
    status: 'abandonado',
    sectionId: 'sectionAbandonado',
    gridId: 'abandonadoGrid',
    emptyId: 'emptyAbandonado',
    countId: 'countAbandonado',
    title: 'Abandonados',
    icon: 'x',
  },
];

let ratingsCache = {};

async function getRating(livroId) {
  if (ratingsCache[livroId] !== undefined) return ratingsCache[livroId];
  try {
    const resenhas = await listarResenhas(livroId) || [];
    if (resenhas.length === 0) {
      ratingsCache[livroId] = null;
      return null;
    }
    const media = resenhas.reduce((acc, r) => acc + (r.nota || 0), 0) / resenhas.length;
    ratingsCache[livroId] = media;
    return media;
  } catch {
    return null;
  }
}

function buildBookCard(item, book, statusConfig, idx) {
  const titulo = book.titulo || '';
  const autor = book.autor || '';
  const genero = book.genero || '';
  const hasImage = book.urlCapa || book.capaUrl;
  const imageUrl = book.urlCapa || book.capaUrl || '';
  const nota = item._rating || null;
  const progresso = item.progresso || 0;

  let statusBadgeClass = '';
  if (statusConfig.status === 'lendo') statusBadgeClass = 'status-badge-lendo';
  else if (statusConfig.status === 'relendo') statusBadgeClass = 'status-badge-relendo';
  else if (statusConfig.status === 'lido') statusBadgeClass = 'status-badge-lido';
  else if (statusConfig.status === 'quero_ler') statusBadgeClass = 'status-badge-quero-ler';
  else if (statusConfig.status === 'abandonado') statusBadgeClass = 'status-badge-abandonado';

  let bodyBottom = '';

  if (statusConfig.status === 'lendo' || statusConfig.status === 'relendo') {
    if (progresso > 0) {
      bodyBottom = `
        <div class="cover-progress" style="position:static;height:6px;background:var(--color-bg);border-radius:var(--radius-full);margin-top:8px;overflow:hidden">
          <div class="cover-progress-bar" style="width:${Math.min(100, progresso)}%;border-radius:var(--radius-full)"></div>
        </div>
        <span class="progress-text">${Math.min(100, progresso)}% concluído</span>`;
    } else {
      bodyBottom = `<span class="leitura-status-badge ${statusBadgeClass}">Lendo agora</span>`;
    }
  } else if (statusConfig.status === 'lido') {
    bodyBottom = `
      <span class="leitura-status-badge ${statusBadgeClass}">Concluído</span>
      ${item.dataFim ? `<span class="completion-date">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        ${formatDate(item.dataFim)}
      </span>` : ''}`;
  } else if (statusConfig.status === 'quero_ler') {
    bodyBottom = `<span class="leitura-status-badge ${statusBadgeClass}">Na lista</span>`;
  } else if (statusConfig.status === 'abandonado') {
    bodyBottom = `<span class="leitura-status-badge ${statusBadgeClass}">Abandonado</span>`;
  }

  return `
    <a href="livro-detalhes.html?id=${item.idLivro}" class="book-card" style="animation-delay:${idx * 0.04}s">
      <div class="book-card-cover">
        ${hasImage ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(titulo)}" loading="lazy" onerror="this.onerror=null;this.src='../assets/img/placeholder-book.svg'">` : `<div class="cover-icon-bg">&#128218;</div>`}
        <div class="cover-overlay"></div>
        <span class="cover-title">${escapeHtml(titulo)}</span>
        <span class="cover-author">${escapeHtml(autor)}</span>
        ${genero ? `<span class="cover-genre-badge">${escapeHtml(genero)}</span>` : ''}
        ${progresso > 0 ? `<div class="cover-progress"><div class="cover-progress-bar" style="width:${Math.min(100, progresso)}%"></div></div>` : ''}
      </div>
      <div class="book-card-body">
        <h3>${escapeHtml(titulo)}</h3>
        <p class="author">${escapeHtml(autor)}</p>
        ${nota ? `<div>${renderSvgStars(nota, 12)}</div>` : ''}
        ${genero ? `<span class="genre-tag">${escapeHtml(genero)}</span>` : ''}
        ${bodyBottom}
      </div>
    </a>`;
}

async function loadLeituras() {
  const user = getUser();
  const loading = document.getElementById('loading');
  const empty = document.getElementById('emptyState');

  loading.classList.remove('hidden');

  try {
    const leituras = await listarLeituras(user.id) || [];
    const grouped = { lendo: [], lido: [], quero_ler: [], relendo: [], abandonado: [] };

    for (const leitura of leituras) {
      const status = leitura.status;
      if (!grouped[status]) continue;
      try {
        const book = await buscarLivro(leitura.idLivro);
        grouped[status].push({ ...leitura, livro: book });
      } catch {
        grouped[status].push({ ...leitura, livro: { titulo: 'Livro não encontrado', autor: '' } });
      }
    }

    let total = 0;

    for (const section of STATUS_SECTIONS) {
      const items = grouped[section.status] || [];
      const sectionEl = document.getElementById(section.sectionId);
      const grid = document.getElementById(section.gridId);
      const emptyEl = document.getElementById(section.emptyId);
      const countEl = document.getElementById(section.countId);

      if (items.length === 0) {
        sectionEl.classList.add('hidden');
        continue;
      }

      total += items.length;
      sectionEl.classList.remove('hidden');
      countEl.textContent = items.length;

      const cards = await Promise.all(items.map(async (item, idx) => {
        const book = item.livro || {};
        item._rating = await getRating(item.idLivro);
        return buildBookCard(item, book, section, idx);
      }));

      grid.innerHTML = cards.join('');
    }

    empty.classList.toggle('hidden', total > 0);
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    loading.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderNavbar('leituras.html');
  loadLeituras();
});

window.addEventListener('pageshow', (e) => {
  if (e.persisted) loadLeituras();
});
