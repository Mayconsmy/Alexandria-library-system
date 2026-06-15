async function listarLeituras(usuarioId) {
  return apiGet(`/leituras/usuario/${usuarioId}`);
}

async function registrarLeitura(dados) {
  return apiPost('/leituras', dados);
}

async function atualizarLeitura(id, dados) {
  return apiPut(`/leituras/${id}`, dados);
}

async function buscarLeituraPorUsuarioELivro(usuarioId, livroId) {
  try {
    return await apiGet(`/leituras/usuario/${usuarioId}/livro/${livroId}`);
  } catch {
    return null;
  }
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

