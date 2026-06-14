async function listarMetas(usuarioId) {
  return apiGet(`/metas/usuario/${usuarioId}`);
}

async function criarMeta(dados) {
  return apiPost('/metas', dados);
}

async function listarNotificacoes(usuarioId) {
  return apiGet(`/notificacoes/usuario/${usuarioId}`);
}

async function marcarNotificacaoLida(id) {
  return apiPut(`/notificacoes/${id}/lida`);
}

async function buscarEstatisticas(usuarioId) {
  return apiGet(`/estatisticas/usuario/${usuarioId}`);
}
