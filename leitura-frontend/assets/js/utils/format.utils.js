function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR');
}

function formatDateTime(dateTimeString) {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate2(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR');
}

function escapeHtml(text) {
  if (text == null) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function getStarColors() {
  const style = getComputedStyle(document.documentElement);
  return {
    gold: style.getPropertyValue('--color-gold').trim() || '#f5b342',
    muted: style.getPropertyValue('--color-text-muted').trim() || '#d0d0e0',
  };
}

function renderSvgStars(rating, size = 14) {
  if (rating == null) return '';
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const { gold, muted } = getStarColors();
  let html = '<span class="stars-svg" style="display:inline-flex;gap:2px;align-items:center;vertical-align:middle">';
  for (let i = 1; i <= 5; i++) {
    const isFull = i <= full;
    const isHalf = !isFull && i === full + 1 && half;
    const fill = isFull || isHalf ? gold : muted;
    const clip = isHalf ? ` style="clip-path:inset(0 50% 0 0)"` : '';
    html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${isFull ? fill : 'none'}" stroke="${fill}" stroke-width="1.5" style="display:inline-block">`;
    html += `<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" ${isHalf ? `fill="none"` : ''} />`;
    if (isHalf) {
      html += `<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="${gold}" clip-path="inset(0 50% 0 0)" />`;
    }
    html += '</svg>';
  }
  html += '</span>';
  return html;
}
