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

function formatStatus(status) {
  const map = {
    'lendo': 'Lendo',
    'lido': 'Lido',
    'quero_ler': 'Quero Ler',
  };
  return map[status] || status;
}

function statusClass(status) {
  const map = {
    'lendo': 'card-badge-warning',
    'lido': 'card-badge-success',
    'quero_ler': 'card-badge-error',
  };
  return map[status] || '';
}

function truncate(text, maxLen = 100) {
  if (!text || text.length <= maxLen) return text || '';
  return text.substring(0, maxLen) + '...';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
