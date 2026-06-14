package br.edu.clubeleitura.service;

import br.edu.clubeleitura.dto.request.GrupoRequestDTO;
import br.edu.clubeleitura.dto.response.GrupoResponseDTO;
import br.edu.clubeleitura.exception.ResourceNotFoundException;
import br.edu.clubeleitura.model.GrupoLeitura;
import br.edu.clubeleitura.model.Usuario;
import br.edu.clubeleitura.repository.GrupoLeituraRepository;
import br.edu.clubeleitura.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GrupoLeituraService {

    private final GrupoLeituraRepository grupoRepository;
    private final UsuarioRepository usuarioRepository;

    public List<GrupoResponseDTO> listar(String nome) {
        List<GrupoLeitura> grupos = (nome != null)
                ? grupoRepository.findByNomeContainingIgnoreCase(nome)
                : grupoRepository.findAll();
        return grupos.stream().map(this::toResponseDTO).toList();
    }

    public GrupoResponseDTO buscarPorId(Integer id) {
        GrupoLeitura grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo não encontrado: " + id));
        return toResponseDTO(grupo);
    }

    @Transactional
    public GrupoResponseDTO criar(GrupoRequestDTO dto) {
        Usuario admin = usuarioRepository.findById(dto.getIdAdmin())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        GrupoLeitura grupo = GrupoLeitura.builder()
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .privado(dto.getPrivado() != null ? dto.getPrivado() : false)
                .admin(admin)
                .build();

        grupo.getMembros().add(admin);
        grupo = grupoRepository.save(grupo);
        return toResponseDTO(grupo);
    }

    @Transactional
    public void entrar(Integer grupoId, Integer usuarioId) {
        GrupoLeitura grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo não encontrado: " + grupoId));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + usuarioId));

        if (grupo.getMembros().stream().anyMatch(m -> m.getId().equals(usuarioId))) {
            throw new IllegalArgumentException("Usuário já é membro do grupo");
        }

        grupo.getMembros().add(usuario);
        grupoRepository.save(grupo);
    }

    private GrupoResponseDTO toResponseDTO(GrupoLeitura grupo) {
        return GrupoResponseDTO.builder()
                .id(grupo.getId())
                .nome(grupo.getNome())
                .descricao(grupo.getDescricao())
                .privado(grupo.getPrivado())
                .dataCriacao(grupo.getDataCriacao())
                .adminNome(grupo.getAdmin().getNome())
                .qtdMembros(grupo.getMembros().size())
                .build();
    }
}
