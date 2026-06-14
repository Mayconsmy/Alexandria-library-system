async function listarLeituras(usuarioId) {
  return apiGet(`/leituras/usuario/${usuarioId}`);
}

async function registrarLeitura(dados) {
  return apiPost('/leituras', dados);
}

async function atualizarLeitura(id, dados) {
  return apiPut(`/leituras/${id}`, dados);
}

async function listarResenhas(livroId) {
  return apiGet(`/resenhas/livro/${livroId}`);
}

async function criarResenha(dados) {
  return apiPost('/resenhas', dados);
}

async function atualizarResenha(id, dados) {
  return apiPut(`/resenhas/${id}`, dados);
}

async function deletarResenha(id) {
  return apiDelete(`/resenhas/${id}`);
}
