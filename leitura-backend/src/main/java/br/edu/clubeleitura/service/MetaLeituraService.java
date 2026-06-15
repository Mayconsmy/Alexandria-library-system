package br.edu.clubeleitura.service;

import br.edu.clubeleitura.dto.request.MetaRequestDTO;
import br.edu.clubeleitura.dto.response.MetaResponseDTO;
import br.edu.clubeleitura.exception.ResourceNotFoundException;
import br.edu.clubeleitura.model.MetaLeitura;
import br.edu.clubeleitura.model.Usuario;
import br.edu.clubeleitura.repository.LeituraRepository;
import br.edu.clubeleitura.repository.MetaLeituraRepository;
import br.edu.clubeleitura.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MetaLeituraService {

    private final MetaLeituraRepository metaRepository;
    private final UsuarioRepository usuarioRepository;
    private final LeituraRepository leituraRepository;

    public List<MetaResponseDTO> listarPorUsuario(Integer usuarioId) {
        return metaRepository.findByUsuarioId(usuarioId).stream()
                .map(this::toResponseDTO).toList();
    }

    @Transactional
    public MetaResponseDTO criar(MetaRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        LocalDate hoje = LocalDate.now();
        LocalDate prazo = dto.getPrazo();

        if (prazo.isBefore(hoje)) {
            throw new IllegalArgumentException("O prazo deve ser a partir de hoje");
        }
        if (prazo.isAfter(hoje.plusYears(150))) {
            throw new IllegalArgumentException("O prazo máximo é " + hoje.plusYears(150));
        }

        long lidos = leituraRepository.countByUsuarioIdAndStatus(dto.getIdUsuario(), "lido");

        MetaLeitura meta = MetaLeitura.builder()
                .usuario(usuario)
                .quantidadeLivros(dto.getQuantidadeLivros())
                .prazo(prazo)
                .progresso(Math.min((int) lidos, dto.getQuantidadeLivros()))
                .build();

        meta = metaRepository.save(meta);
        return toResponseDTO(meta);
    }

    @Transactional
    public MetaResponseDTO atualizar(Integer id, MetaRequestDTO dto) {
        MetaLeitura meta = metaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meta não encontrada: " + id));

        LocalDate hoje = LocalDate.now();
        LocalDate prazo = dto.getPrazo();

        if (prazo != null) {
            if (prazo.isBefore(hoje)) {
                throw new IllegalArgumentException("O prazo deve ser a partir de hoje");
            }
            if (prazo.isAfter(hoje.plusYears(150))) {
                throw new IllegalArgumentException("O prazo máximo é " + hoje.plusYears(150));
            }
            meta.setPrazo(prazo);
        }

        if (dto.getQuantidadeLivros() != null && dto.getQuantidadeLivros() >= 1) {
            meta.setQuantidadeLivros(dto.getQuantidadeLivros());
        }

        meta = metaRepository.save(meta);
        return toResponseDTO(meta);
    }

    @Transactional
    public void deletar(Integer id) {
        if (!metaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Meta não encontrada: " + id);
        }
        metaRepository.deleteById(id);
    }

    @Transactional
    public void recalcularProgresso(Integer usuarioId) {
        long lidos = leituraRepository.countByUsuarioIdAndStatus(usuarioId, "lido");
        List<MetaLeitura> metas = metaRepository.findByUsuarioId(usuarioId);
        for (MetaLeitura meta : metas) {
            meta.setProgresso(Math.min((int) lidos, meta.getQuantidadeLivros()));
            metaRepository.save(meta);
        }
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
