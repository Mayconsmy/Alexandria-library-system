package br.edu.clubeleitura.service;

import br.edu.clubeleitura.dto.request.MetaRequestDTO;
import br.edu.clubeleitura.dto.response.MetaResponseDTO;
import br.edu.clubeleitura.exception.ResourceNotFoundException;
import br.edu.clubeleitura.model.MetaLeitura;
import br.edu.clubeleitura.model.Usuario;
import br.edu.clubeleitura.repository.MetaLeituraRepository;
import br.edu.clubeleitura.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MetaLeituraService {

    private final MetaLeituraRepository metaRepository;
    private final UsuarioRepository usuarioRepository;

    public List<MetaResponseDTO> listarPorUsuario(Integer usuarioId) {
        return metaRepository.findByUsuarioId(usuarioId).stream()
                .map(this::toResponseDTO).toList();
    }

    @Transactional
    public MetaResponseDTO criar(MetaRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        MetaLeitura meta = MetaLeitura.builder()
                .usuario(usuario)
                .quantidadeLivros(dto.getQuantidadeLivros())
                .prazo(dto.getPrazo())
                .progresso(0)
                .build();

        meta = metaRepository.save(meta);
        return toResponseDTO(meta);
    }

    private MetaResponseDTO toResponseDTO(MetaLeitura meta) {
        return MetaResponseDTO.builder()
                .id(meta.getId())
                .idUsuario(meta.getUsuario().getId())
                .nomeUsuario(meta.getUsuario().getNome())
                .quantidadeLivros(meta.getQuantidadeLivros())
                .prazo(meta.getPrazo())
                .progresso(meta.getProgresso())
                .build();
    }
}
