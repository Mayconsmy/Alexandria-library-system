async function listarGrupos(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiGet(`/grupos${query ? '?' + query : ''}`);
}

async function buscarGrupo(id) {
  return apiGet(`/grupos/${id}`);
}

async function criarGrupo(dados) {
  return apiPost('/grupos', dados);
}

async function entrarGrupo(grupoId, usuarioId) {
  return apiPost(`/grupos/${grupoId}/entrar`, { idUsuario: usuarioId });
}

async function listarMensagens(grupoId) {
  return apiGet(`/grupos/${grupoId}/mensagens`);
}

async function enviarMensagem(grupoId, dados) {
  return apiPost(`/grupos/${grupoId}/mensagens`, dados);
}
