async function listarLivros(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiGet(`/livros${query ? '?' + query : ''}`);
}

async function buscarLivro(id) {
  return apiGet(`/livros/${id}`);
}

async function criarLivro(dados) {
  return apiPost('/livros', dados);
}

async function atualizarLivro(id, dados) {
  return apiPut(`/livros/${id}`, dados);
}

async function deletarLivro(id) {
  return apiDelete(`/livros/${id}`);
}
