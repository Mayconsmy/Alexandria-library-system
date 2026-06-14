package br.edu.clubeleitura.service;

import br.edu.clubeleitura.dto.response.NotificacaoResponseDTO;
import br.edu.clubeleitura.exception.ResourceNotFoundException;
import br.edu.clubeleitura.model.Notificacao;
import br.edu.clubeleitura.model.Usuario;
import br.edu.clubeleitura.repository.NotificacaoRepository;
import br.edu.clubeleitura.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public List<NotificacaoResponseDTO> listarPorUsuario(Integer usuarioId) {
        return notificacaoRepository.findByUsuarioIdOrderByDataDesc(usuarioId).stream()
                .map(this::toResponseDTO).toList();
    }

    @Transactional
    public void criar(Integer usuarioId, String mensagem) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Notificacao notificacao = Notificacao.builder()
                .usuario(usuario)
                .mensagem(mensagem)
                .build();

        notificacaoRepository.save(notificacao);
    }

    @Transactional
    public void marcarComoLida(Integer id) {
        Notificacao notificacao = notificacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notificação não encontrada: " + id));
        notificacao.setLida(true);
        notificacaoRepository.save(notificacao);
    }

    public long countNaoLidas(Integer usuarioId) {
        return notificacaoRepository.countByUsuarioIdAndLidaFalse(usuarioId);
    }

    private NotificacaoResponseDTO toResponseDTO(Notificacao notificacao) {
        return NotificacaoResponseDTO.builder()
                .id(notificacao.getId())
                .idUsuario(notificacao.getUsuario().getId())
                .mensagem(notificacao.getMensagem())
                .data(notificacao.getData())
                .lida(notificacao.getLida())
                .build();
    }
}
