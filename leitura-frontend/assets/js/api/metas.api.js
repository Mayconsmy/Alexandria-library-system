async function listarMetas(usuarioId) {
  return apiGet(`/metas/usuario/${usuarioId}`);
}

async function criarMeta(dados) {
  return apiPost('/metas', dados);
}

async function buscarEstatisticas(usuarioId) {
  return apiGet(`/estatisticas/usuario/${usuarioId}`);
}

async function atualizarMeta(id, data) {
  return apiPut(`/metas/${id}`, data);
}

async function deletarMeta(id) {
  return apiDelete(`/metas/${id}`);
}
