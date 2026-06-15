async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
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

function apiGet(endpoint) {
  return apiRequest(endpoint, { method: 'GET' });
}

function apiPost(endpoint, data) {
  return apiRequest(endpoint, { method: 'POST', body: data });
}

function apiPut(endpoint, data) {
  return apiRequest(endpoint, { method: 'PUT', body: data });
}

function apiDelete(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}
