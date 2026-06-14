async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem(TOKEN_KEY);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const body = await response.json();

  if (!response.ok) {
    const message = body.message || 'Erro inesperado';
    const code = body.code || response.status;
    const error = new Error(message);
    error.code = code;
    error.errors = body.errors;
    throw error;
  }

  return body.data;
}
