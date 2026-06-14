async function login(email, senha) {
  const data = await apiPost('/auth/login', { email, senha });
  saveAuth(data.token, { id: data.id, nome: data.nome, email: data.email, fotoPerfil: data.fotoPerfil });
  return data;
}

async function cadastrar(nome, email, senha) {
  return apiPost('/auth/cadastro', { nome, email, senha });
}

async function buscarUsuario(id) {
  return apiGet(`/usuarios/${id}`);
}

async function atualizarUsuario(id, dados) {
  return apiPut(`/usuarios/${id}`, dados);
}
