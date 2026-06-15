document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;

  const user = getUser();
  renderNavbar('dashboard.html');

  document.getElementById('userName').textContent = user.nome;

  try {
    const [stats, metas, leituras] = await Promise.all([
      buscarEstatisticas(user.id).catch(() => null),
      listarMetas(user.id).catch(() => []),
      listarLeituras(user.id).catch(() => []),
    ]);

    renderHeroSummary(stats, leituras);
    renderStats(stats);
    renderGoals(metas);
    renderRecentReadings(leituras);
  } catch (err) {
    showToast(err.message, 'error');
  }
});

function renderHeroSummary(stats, leituras) {
  const summary = document.getElementById('userSummary');

  if (!stats && (!leituras || leituras.length === 0)) {
    summary.textContent = 'Comece a explorar a biblioteca para ver suas estatísticas!';
    return;
  }

  const active = (leituras || []).filter(l => l.status === 'lendo').length;
  const lidos = stats ? stats.livrosLidos : 0;
  const total = (leituras || []).length;

  if (total === 0) {
    summary.textContent = 'Explore a biblioteca e comece sua jornada de leitura!';
  } else if (active > 0) {
    summary.textContent = `${active} livro${active > 1 ? 's' : ''} em leitura · ${lidos} lido${lidos !== 1 ? 's' : ''} no total`;
  } else {
    summary.textContent = `${lidos} livro${lidos !== 1 ? 's' : ''} lido${lidos !== 1 ? 's' : ''} · ${total} registro${total !== 1 ? 's' : ''} no total`;
  }
}

function renderStats(stats) {
  if (!stats) {
    document.getElementById('statLendo').textContent = '—';
    document.getElementById('statLido').textContent = '—';
    document.getElementById('statDesejados').textContent = '—';
    document.getElementById('statAbandonados').textContent = '—';
    document.getElementById('statAvaliacao').textContent = '—';
    return;
  }

  animateValue('statLendo', stats.livrosEmLeitura || 0);
  animateValue('statLido', stats.livrosLidos || 0);
  animateValue('statDesejados', stats.livrosDesejados || 0);
  animateValue('statAbandonados', stats.livrosAbandonados || 0);

  const avg = stats.mediaAvaliacoes;
  document.getElementById('statAvaliacao').innerHTML = avg != null ? renderSvgStars(avg, 18) : '—';
}

function animateValue(id, target) {
  const el = document.getElementById(id);
  const duration = 600;
  const start = performance.now();
  const from = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (target - from) * eased);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function renderGoals(metas) {
  const list = document.getElementById('goalsList');
  const empty = document.getElementById('goalsEmpty');
  const heroGoalTitle = document.getElementById('heroGoalTitle');
  const heroGoalBarFill = document.getElementById('heroGoalBarFill');
  const heroGoalPct = document.getElementById('heroGoalPct');

  const activeMetas = (metas || []).filter(m => m.progresso < m.quantidadeLivros);

  if (activeMetas.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    heroGoalTitle.textContent = 'Nenhuma meta ativa';
    heroGoalBarFill.style.width = '0%';
    heroGoalPct.textContent = '0%';
    return;
  }

  empty.classList.add('hidden');

  const topMeta = activeMetas.sort((a, b) => {
    const pctA = a.progresso / a.quantidadeLivros;
    const pctB = b.progresso / b.quantidadeLivros;
    return pctB - pctA;
  })[0];

  const topPct = Math.round((topMeta.progresso / topMeta.quantidadeLivros) * 100);
  heroGoalTitle.textContent = `${topMeta.progresso} de ${topMeta.quantidadeLivros} livros`;
  heroGoalBarFill.style.width = `${Math.min(100, topPct)}%`;
  heroGoalPct.textContent = `${topPct}%`;

  list.innerHTML = activeMetas.map(m => {
    const pct = Math.round((m.progresso / m.quantidadeLivros) * 100);
    return `
      <div class="goal-card">
        <div class="goal-card-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
        </div>
        <div class="goal-card-info">
          <div class="goal-card-title">${m.quantidadeLivros} livro${m.quantidadeLivros > 1 ? 's' : ''}</div>
          <div class="goal-card-subtitle">${m.prazo ? `Prazo: ${formatDate(m.prazo)}` : 'Sem prazo definido'}</div>
        </div>
        <div class="goal-card-progress">
          <div class="goal-card-bar">
            <div class="goal-card-bar-fill" style="width:${Math.min(100, pct)}%"></div>
          </div>
          <span class="goal-card-pct">${m.progresso} / ${m.quantidadeLivros} (${pct}%)</span>
        </div>
      </div>`;
  }).join('');
}

async function renderRecentReadings(leituras) {
  const grid = document.getElementById('recentGrid');
  const empty = document.getElementById('recentEmpty');

  const sorted = (leituras || [])
    .sort((a, b) => new Date(b.dataFim || b.dataInicio || 0) - new Date(a.dataFim || a.dataInicio || 0))
    .slice(0, 4);

  if (sorted.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  const cards = await Promise.all(sorted.map(async (item, idx) => {
    try {
      const book = await buscarLivro(item.idLivro);
      const titulo = book.titulo || '';
      const autor = book.autor || '';
      const progress = item.progresso || 0;
      const hasImage = book.urlCapa || book.capaUrl;
      const imageUrl = book.urlCapa || book.capaUrl || '';

      return `
        <a href="livro-detalhes.html?id=${item.idLivro}" class="book-card" style="animation-delay:${idx * 0.04}s">
          <div class="book-card-cover">
            ${hasImage ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(titulo)}" loading="lazy" onerror="this.onerror=null;this.src='../assets/img/placeholder-book.svg'">` : `<div class="cover-icon-bg">&#128218;</div>`}
            <div class="cover-overlay"></div>
            <span class="cover-title">${escapeHtml(titulo)}</span>
            <span class="cover-author">${escapeHtml(autor)}</span>
          </div>
          <div class="book-card-body">
            <h3>${escapeHtml(titulo)}</h3>
            <p class="author">${escapeHtml(autor)}</p>
          </div>
        </a>`;
    } catch {
      return '';
    }
  }));

  grid.innerHTML = cards.filter(c => c).join('');
}
