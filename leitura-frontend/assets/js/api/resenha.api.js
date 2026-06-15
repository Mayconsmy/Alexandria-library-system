async function listarResenhasPorUsuario(usuarioId, params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiGet(`/resenhas/usuario/${usuarioId}${query ? '?' + query : ''}`);
}
