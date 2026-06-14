let grupoId = null;
let currentUser = null;

async function loadGroup() {
  const params = new URLSearchParams(window.location.search);
  grupoId = parseInt(params.get('id'));
  if (!grupoId) {
    showToast('ID do grupo não informado', 'error');
    return;
  }

  currentUser = getUser();
  const loading = document.getElementById('loading');
  const detail = document.getElementById('groupDetail');

  loading.classList.remove('hidden');
  detail.classList.add('hidden');

  try {
    const grupo = await buscarGrupo(grupoId);

    document.getElementById('groupName').textContent = grupo.nome;
    document.getElementById('groupAdmin').textContent = `Administrador: ${escapeHtml(grupo.adminNome)}`;
    document.getElementById('groupDescription').textContent = grupo.descricao || 'Sem descrição.';
    document.getElementById('groupMembers').textContent = `${grupo.qtdMembros} membro${grupo.qtdMembros !== 1 ? 's' : ''}`;

    detail.classList.remove('hidden');
    loadMessages();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    loading.classList.add('hidden');
  }
}

async function loadMessages() {
  const container = document.getElementById('messagesList');

  try {
    const messages = await listarMensagens(grupoId);

    if (messages.length === 0) {
      container.innerHTML = '<p class="text-muted text-center">Nenhuma mensagem ainda.</p>';
      return;
    }

    container.innerHTML = messages.map(m => {
      const isMe = m.idUsuario === currentUser.id;
      return `
        <div class="message ${isMe ? 'me' : ''}">
          <div class="message-header">
            <span class="message-author">${escapeHtml(m.nomeUsuario)}</span>
            <span class="message-time">${formatDateTime(m.dataEnvio)}</span>
          </div>
          <p class="message-content">${escapeHtml(m.conteudo)}</p>
        </div>
      `;
    }).join('');

    container.scrollTop = container.scrollHeight;
  } catch (err) {
    container.innerHTML = '<p class="text-muted text-center">Erro ao carregar mensagens.</p>';
  }
}

async function handleSendMessage() {
  const input = document.getElementById('messageInput');
  const texto = input.value.trim();

  if (!texto) {
    showToast('Digite uma mensagem', 'warning');
    return;
  }

  try {
    await enviarMensagem(grupoId, {
      idUsuario: currentUser.id,
      conteudo: texto,
    });

    input.value = '';
    loadMessages();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function handleJoinGroup() {
  try {
    await entrarGrupo(grupoId, currentUser.id);
    showToast('Você entrou no grupo!', 'success');
    loadGroup();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderNavbar('grupos.html');
  loadGroup();

  document.getElementById('sendMessageBtn').addEventListener('click', handleSendMessage);
  document.getElementById('messageInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });
  document.getElementById('joinGroupBtn').addEventListener('click', handleJoinGroup);
});
