let grupoId = null;
let currentUser = null;
let isMembro = false;

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
    const [grupo, membroStatus] = await Promise.all([
      buscarGrupo(grupoId),
      verificarMembro(grupoId, currentUser.id),
    ]);

    isMembro = membroStatus;

    document.getElementById('groupName').textContent = grupo.nome;
    document.getElementById('groupAdmin').textContent = `Administrador: ${escapeHtml(grupo.adminNome)}`;
    document.getElementById('groupDescription').textContent = grupo.descricao || 'Sem descrição definida.';
    document.getElementById('groupMembers').textContent = `${grupo.qtdMembros} membro${grupo.qtdMembros !== 1 ? 's' : ''}`;
    document.getElementById('chatMemberCount').textContent = `${grupo.qtdMembros} membro${grupo.qtdMembros !== 1 ? 's' : ''}`;

    const visEl = document.getElementById('groupVisibility');
    visEl.textContent = grupo.privado ? 'Privado' : 'Público';
    visEl.className = `group-detail-visibility ${grupo.privado ? 'private' : 'public'}`;

    const avatarConfig = getAvatarConfig(null);
    renderAvatar('chatFormAvatar', avatarConfig, 36);

    updateJoinButton();
    toggleChat();

    detail.classList.remove('hidden');
    if (isMembro) loadMessages();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    loading.classList.add('hidden');
  }
}

function updateJoinButton() {
  const btn = document.getElementById('joinGroupBtn');
  const text = btn.querySelector('.group-action-btn-text');
  const icon = btn.querySelector('.group-action-btn-icon');

  if (isMembro) {
    text.textContent = 'Sair do Grupo';
    icon.innerHTML = '<path d="M5 12h14M12 5l7 7-7 7"/>';
    btn.className = 'group-action-btn sair';
  } else {
    text.textContent = 'Entrar no Grupo';
    icon.innerHTML = '<path d="M12 5v14M5 12h14"/>';
    btn.className = 'group-action-btn entrar';
  }
}

function toggleChat() {
  const chatSection = document.getElementById('chatSection');
  const chatForm = document.getElementById('chatForm');
  if (isMembro) {
    chatSection.classList.remove('hidden');
    chatForm.classList.remove('hidden');
  } else {
    chatSection.classList.add('hidden');
    chatForm.classList.add('hidden');
  }
}

async function loadMessages() {
  const container = document.getElementById('messagesList');

  try {
    const messages = await listarMensagens(grupoId) || [];

    if (messages.length === 0) {
      container.innerHTML = `
        <div class="messages-empty">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <p>Nenhuma mensagem ainda. Seja o primeiro a conversar!</p>
        </div>`;
      return;
    }

    container.innerHTML = messages.map(m => {
      const isMe = m.idUsuario === currentUser.id;
      const avatarConfig = getAvatarConfig(m.fotoPerfil);
      const avatarHTML = avatarConfig ? renderAvatarSVG(avatarConfig, 34) : '';
      return `
        <div class="message ${isMe ? 'me' : ''}">
          <div class="message-avatar">${avatarHTML}</div>
          <div class="message-content-wrap">
            <div class="message-header">
              <span class="message-author">${escapeHtml(m.nomeUsuario)}</span>
              <span class="message-time">${formatDateTime(m.dataEnvio)}</span>
            </div>
            <div class="message-bubble">${escapeHtml(m.conteudo)}</div>
          </div>
        </div>`;
    }).join('');

    container.scrollTop = container.scrollHeight;
  } catch (err) {
    container.innerHTML = '<div class="messages-empty"><p>Erro ao carregar mensagens.</p></div>';
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
    input.style.height = 'auto';
    loadMessages();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function handleToggleGroup() {
  try {
    if (isMembro) {
      await sairGrupo(grupoId, currentUser.id);
      showToast('Você saiu do grupo.', 'success');
    } else {
      await entrarGrupo(grupoId, currentUser.id);
      showToast('Você entrou no grupo!', 'success');
    }
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

  const msgInput = document.getElementById('messageInput');
  msgInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });
  msgInput.addEventListener('input', () => {
    msgInput.style.height = 'auto';
    msgInput.style.height = Math.min(msgInput.scrollHeight, 120) + 'px';
  });

  document.getElementById('joinGroupBtn').addEventListener('click', handleToggleGroup);
});
