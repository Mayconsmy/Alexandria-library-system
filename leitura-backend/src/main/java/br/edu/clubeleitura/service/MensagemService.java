package br.edu.clubeleitura.service;

import br.edu.clubeleitura.dto.response.MensagemResponseDTO;
import br.edu.clubeleitura.exception.ResourceNotFoundException;
import br.edu.clubeleitura.model.GrupoLeitura;
import br.edu.clubeleitura.model.Mensagem;
import br.edu.clubeleitura.model.Usuario;
import br.edu.clubeleitura.repository.GrupoLeituraRepository;
import br.edu.clubeleitura.repository.MensagemRepository;
import br.edu.clubeleitura.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MensagemService {

    private final MensagemRepository mensagemRepository;
    private final GrupoLeituraRepository grupoRepository;
    private final UsuarioRepository usuarioRepository;

    public List<MensagemResponseDTO> listarPorGrupo(Integer grupoId) {
        return mensagemRepository.findByGrupoIdOrderByDataEnvioAsc(grupoId).stream()
                .map(this::toResponseDTO).toList();
    }

    @Transactional
    public MensagemResponseDTO enviar(Integer grupoId, Integer usuarioId, String conteudo) {
        GrupoLeitura grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo não encontrado"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Mensagem mensagem = Mensagem.builder()
                .usuario(usuario)
                .grupo(grupo)
                .conteudo(conteudo)
                .build();

        mensagem = mensagemRepository.save(mensagem);
        return toResponseDTO(mensagem);
    }

    private MensagemResponseDTO toResponseDTO(Mensagem mensagem) {
        return MensagemResponseDTO.builder()
                .id(mensagem.getId())
                .idUsuario(mensagem.getUsuario().getId())
                .nomeUsuario(mensagem.getUsuario().getNome())
                .idGrupo(mensagem.getGrupo().getId())
                .conteudo(mensagem.getConteudo())
                .dataEnvio(mensagem.getDataEnvio())
                .build();
    }
}
