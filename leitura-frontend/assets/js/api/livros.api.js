async function listarLivros(params = {}) {
  const query = new URLSearchParams();
  if (params.titulo) query.set('titulo', params.titulo);
  if (params.autor) query.set('autor', params.autor);
  if (params.genero) query.set('genero', params.genero);
  if (params.editora) query.set('editora', params.editora);
  if (params.descricao) query.set('descricao', params.descricao);
  if (params.busca) query.set('busca', params.busca);
  return apiGet(`/livros${query.toString() ? '?' + query.toString() : ''}`);
}

async function buscarLivro(id) {
  return apiGet(`/livros/${id}`);
}

