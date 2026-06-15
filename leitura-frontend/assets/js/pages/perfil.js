let editAvatarConfig = null;

async function loadProfile() {
  const user = getUser();
  const loading = document.getElementById('loading');
  const content = document.getElementById('profileContent');

  loading.classList.remove('hidden');
  content.classList.add('hidden');

  try {
    const [profile, stats, metas, leituras, grupos, resenhas] = await Promise.all([
      buscarUsuario(user.id),
      buscarEstatisticas(user.id).catch(() => null),
      listarMetas(user.id).catch(() => []),
      listarLeituras(user.id).catch(() => []),
      listarGruposPorUsuario(user.id).catch(() => []),
      listarResenhasPorUsuario(user.id).catch(() => []),
    ]);

    renderHeader(profile, stats, leituras);
    renderStats(stats);
    renderGoal(metas, stats);
    renderReadingNow(leituras);
    renderGroups(grupos);
    initProfileReviews(resenhas);

    content.classList.remove('hidden');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    loading.classList.add('hidden');
  }
}

/* ── Section 1: Header ── */

function renderHeader(profile, stats, leituras) {
  document.getElementById('profileName').textContent = profile.nome;
  document.getElementById('profileEmail').textContent = profile.email;
  document.getElementById('profileType').textContent = profile.tipoPerfil || 'Leitor';
  document.getElementById('profileSince').textContent = profile.dataCadastro
    ? `Membro desde ${formatDate(profile.dataCadastro)}`
    : '';

  const avatarConfig = getAvatarConfig(profile.fotoPerfil);
  renderAvatar('profileAvatar', avatarConfig, 112);
}

/* ── Section 2: Stats ── */

function renderStats(stats) {
  if (!stats) {
    document.getElementById('statLidos').textContent = '—';
    document.getElementById('statLendo').textContent = '—';
    document.getElementById('statDesejados').textContent = '—';
    document.getElementById('statAbandonados').textContent = '—';
    document.getElementById('statAvaliacao').textContent = '—';
    return;
  }

  animateValue('statLidos', stats.livrosLidos || 0);
  animateValue('statLendo', stats.livrosEmLeitura || 0);
  animateValue('statDesejados', stats.livrosDesejados || 0);
  animateValue('statAbandonados', stats.livrosAbandonados || 0);

  const avg = stats.mediaAvaliacoes;
  document.getElementById('statAvaliacao').innerHTML = avg != null ? renderSvgStars(avg, 18) : '—';
}

function animateValue(id, target) {
  const el = document.getElementById(id);
  const duration = 600;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(0 + (target - 0) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* ── Section 3: Goal ── */

function renderGoal(metas, stats) {
  const goalValue = document.getElementById('goalValue');
  const barFill = document.getElementById('goalBarFill');
  const pct = document.getElementById('goalPct');
  const remaining = document.getElementById('goalRemaining');

  const activeMetas = (metas || []).filter(m => m.progresso < m.quantidadeLivros);

  if (activeMetas.length === 0 && stats) {
    const lidos = stats.livrosLidos || 0;
    goalValue.textContent = `${lidos} livro${lidos !== 1 ? 's' : ''}`;
    barFill.style.width = '0%';
    pct.textContent = 'Nenhuma meta ativa';
    remaining.textContent = 'Defina uma meta em Metas de Leitura';
    return;
  }

  if (activeMetas.length === 0) {
    goalValue.textContent = '—';
    barFill.style.width = '0%';
    pct.textContent = 'Nenhuma meta ativa';
    remaining.textContent = '';
    return;
  }

  const top = activeMetas.sort((a, b) => {
    return (b.progresso / b.quantidadeLivros) - (a.progresso / a.quantidadeLivros);
  })[0];

  const targetPct = Math.round((top.progresso / top.quantidadeLivros) * 100);
  const rest = top.quantidadeLivros - top.progresso;

  goalValue.textContent = `${top.progresso} / ${top.quantidadeLivros} livro${top.quantidadeLivros > 1 ? 's' : ''}`;
  barFill.style.width = `${Math.min(100, targetPct)}%`;
  pct.textContent = `${targetPct}% concluído`;
  remaining.textContent = `${rest} livro${rest !== 1 ? 's' : ''} restante${rest !== 1 ? 's' : ''}`;
}

/* ── Section 4: Reading Now ── */

function renderReadingNow(leituras) {
  const grid = document.getElementById('readingGrid');
  const empty = document.getElementById('readingEmpty');

  const lendo = (leituras || []).filter(l => l.status === 'lendo');

  if (lendo.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  Promise.all(lendo.map(async (item, idx) => {
    try {
      const book = await buscarLivro(item.idLivro);
      const titulo = book.titulo || '';
      const autor = book.autor || '';
      const genero = book.genero || '';
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
            ${genero ? `<span class="cover-genre-badge">${escapeHtml(genero)}</span>` : ''}
            ${progress > 0 ? `<div class="cover-progress" style="height:5px"><div class="cover-progress-bar" style="width:${Math.min(100, progress)}%"></div></div>` : ''}
          </div>
          <div class="book-card-body">
            <h3>${escapeHtml(titulo)}</h3>
            <p class="author">${escapeHtml(autor)}</p>
            ${genero ? `<span class="genre-tag">${escapeHtml(genero)}</span>` : ''}
            ${progress > 0 ? `<div style="margin-top:6px"><div class="cover-progress" style="position:static;height:5px;background:var(--color-bg);border-radius:var(--radius-full);overflow:hidden"><div class="cover-progress-bar" style="width:${Math.min(100, progress)}%;border-radius:var(--radius-full)"></div></div><span style="font-size:11px;font-weight:600;color:var(--color-primary)">${Math.min(100, progress)}%</span></div>` : ''}
          </div>
        </a>`;
    } catch {
      return '';
    }
  })).then(cards => {
    grid.innerHTML = cards.filter(c => c).join('');
  });
}

/* ── Section 5: Groups ── */

function renderGroups(grupos) {
  const list = document.getElementById('groupsList');
  const empty = document.getElementById('groupsEmpty');

  if (!grupos || grupos.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  list.innerHTML = grupos.map(g => `
    <a href="grupo-detalhes.html?id=${g.id}" class="profile-group-tag">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
      ${escapeHtml(g.nome)}
    </a>
  `).join('');
}

/* ── Section 6: Reviews ── */

let profileBooksCache = {};
let profileAllResenhas = [];

async function fetchProfileBooks(reviews) {
  const uniqueIds = [...new Set(reviews.map(r => r.idLivro))];
  const missing = uniqueIds.filter(id => !profileBooksCache[id]);
  if (missing.length === 0) return;
  const results = await Promise.allSettled(missing.map(id => buscarLivro(id)));
  results.forEach((res, i) => {
    if (res.status === 'fulfilled') {
      profileBooksCache[missing[i]] = res.value;
    }
  });
}

function populateProfileGenreFilter(reviews) {
  const select = document.getElementById('reviewGenreFilter');
  const genres = new Set();
  reviews.forEach(r => {
    const book = profileBooksCache[r.idLivro];
    if (book && book.genero) genres.add(book.genero);
  });
  const current = select.value;
  select.innerHTML = '<option value="">Todos os gêneros</option>' +
    [...genres].sort().map(g => `<option value="${escapeHtml(g)}">${escapeHtml(g)}</option>`).join('');
  select.value = current;
}

async function initProfileReviews(resenhas) {
  profileAllResenhas = resenhas;
  await fetchProfileBooks(resenhas);
  populateProfileGenreFilter(resenhas);
  applyProfileFilters();
}

function renderReviews(reviews) {
  const list = document.getElementById('reviewsList');
  const empty = document.getElementById('reviewsEmpty');
  const currentUserId = getUser().id;

  if (reviews.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  list.innerHTML = reviews.map((r, idx) => {
    const book = profileBooksCache[r.idLivro];
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
              <button class="btn btn-sm btn-secondary" onclick="showProfileEditReviewModal(${r.id})">Editar</button>
              <button class="btn btn-sm btn-danger" onclick="handleProfileDeleteReview(${r.id})">Excluir</button>
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

function showProfileEditReviewModal(reviewId) {
  const review = profileAllResenhas.find(r => r.id === reviewId);
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
      const idx = profileAllResenhas.findIndex(r => r.id === reviewId);
      if (idx !== -1) profileAllResenhas[idx] = updated;
      showToast('Resenha atualizada!', 'success');
      applyProfileFilters();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

async function handleProfileDeleteReview(reviewId) {
  if (!confirm('Tem certeza que deseja excluir esta resenha?')) return;
  try {
    await deletarResenha(reviewId);
    profileAllResenhas = profileAllResenhas.filter(r => r.id !== reviewId);
    showToast('Resenha excluída!', 'success');
    applyProfileFilters();
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

function applyProfileFilters() {
  const busca = document.getElementById('reviewSearchInput').value.trim().toLowerCase();
  const estrelas = document.getElementById('reviewStarsFilter').value;
  const genreVal = document.getElementById('reviewGenreFilter').value;
  const dateDays = document.getElementById('reviewDateFilter').value;

  let filtered = profileAllResenhas;

  if (busca) {
    filtered = filtered.filter(r => {
      const book = profileBooksCache[r.idLivro];
      const inTitulo = r.tituloLivro.toLowerCase().includes(busca);
      const inAutor = book && book.autor && book.autor.toLowerCase().includes(busca);
      const inTexto = r.texto && r.texto.toLowerCase().includes(busca);
      const inGenero = book && book.genero && book.genero.toLowerCase().includes(busca);
      return inTitulo || inAutor || inTexto || inGenero;
    });
  }

  if (estrelas) {
    const target = parseInt(estrelas);
    filtered = filtered.filter(r => r.nota != null && Math.round(r.nota) === target);
  }

  if (genreVal) {
    filtered = filtered.filter(r => {
      const book = profileBooksCache[r.idLivro];
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
}

/* ── Filters ── */

async function filterReviews() {
  const user = getUser();
  const loading = document.getElementById('reviewsLoading');
  loading.classList.remove('hidden');
  try {
    const resenhas = await listarResenhasPorUsuario(user.id) || [];
    profileAllResenhas = resenhas;
    await fetchProfileBooks(resenhas);
    populateProfileGenreFilter(resenhas);
    applyProfileFilters();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    loading.classList.add('hidden');
  }
}

/* ── Edit Profile ── */

function showEditProfileModal() {
  const user = getUser();
  editAvatarConfig = getAvatarConfig(user.fotoPerfil);

  openModal('Editar Perfil', `
    <div class="form-group">
      <label>Nome</label>
      <input type="text" id="editNome" value="${escapeHtml(user.nome)}" required>
    </div>
    <div class="form-group">
      <label>Personalize seu Avatar</label>
      <div id="editAvatarBuilder"></div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" id="confirmEditProfile">Salvar</button>
  `);

  renderAvatarOptions('editAvatarBuilder', editAvatarConfig, (cfg) => { editAvatarConfig = cfg; });

  document.getElementById('confirmEditProfile').addEventListener('click', async () => {
    const nome = document.getElementById('editNome').value.trim();
    if (!nome) {
      showToast('Nome é obrigatório', 'warning');
      return;
    }

    try {
      const fotoPerfil = editAvatarConfig ? JSON.stringify(editAvatarConfig) : null;
      const updated = await atualizarUsuario(user.id, {
        id: user.id,
        nome,
        fotoPerfil,
        email: user.email,
      });

      const currentUser = getUser();
      saveAuth(getToken(), { ...currentUser, nome: updated.nome, fotoPerfil: updated.fotoPerfil });
      closeModal();
      showToast('Perfil atualizado!', 'success');
      loadProfile();
      renderNavbar('perfil.html');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

/* ── Init ── */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderNavbar('perfil.html');
  loadProfile();

  document.getElementById('editProfileBtn').addEventListener('click', showEditProfileModal);
  document.getElementById('reviewSearchInput').addEventListener('input', debounce(applyProfileFilters, 400));
  document.getElementById('reviewStarsFilter').addEventListener('change', applyProfileFilters);
  document.getElementById('reviewGenreFilter').addEventListener('change', applyProfileFilters);
  document.getElementById('reviewDateFilter').addEventListener('change', applyProfileFilters);
});
