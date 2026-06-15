package br.edu.clubeleitura.service;

import br.edu.clubeleitura.dto.request.LeituraRequestDTO;
import br.edu.clubeleitura.dto.response.LeituraResponseDTO;
import br.edu.clubeleitura.exception.ResourceNotFoundException;
import br.edu.clubeleitura.model.Leitura;
import br.edu.clubeleitura.model.Livro;
import br.edu.clubeleitura.model.Usuario;
import br.edu.clubeleitura.repository.LeituraRepository;
import br.edu.clubeleitura.repository.LivroRepository;
import br.edu.clubeleitura.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LeituraService {

    private final LeituraRepository leituraRepository;
    private final UsuarioRepository usuarioRepository;
    private final LivroRepository livroRepository;
    private final EstatisticaService estatisticaService;
    private final MetaLeituraService metaLeituraService;

    public List<LeituraResponseDTO> listarPorUsuario(Integer usuarioId) {
        List<Leitura> leituras = leituraRepository.findByUsuarioId(usuarioId);
        return leituras.stream().map(this::toResponseDTO).toList();
    }

    @Transactional
    public LeituraResponseDTO registrar(LeituraRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        Livro livro = livroRepository.findById(dto.getIdLivro())
                .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado"));

        Optional<Leitura> existing = leituraRepository.findByUsuarioIdAndLivroId(dto.getIdUsuario(), dto.getIdLivro());

        Leitura leitura;
        if (existing.isPresent()) {
            leitura = existing.get();
            leitura.setStatus(dto.getStatus());
            if (dto.getDataInicio() != null) leitura.setDataInicio(dto.getDataInicio());
            if (dto.getDataFim() != null) leitura.setDataFim(dto.getDataFim());
            if ("lido".equals(dto.getStatus()) && leitura.getDataFim() == null) {
                leitura.setDataFim(LocalDate.now());
            }
        } else {
            leitura = Leitura.builder()
                    .usuario(usuario)
                    .livro(livro)
                    .status(dto.getStatus())
                    .dataInicio(dto.getDataInicio())
                    .dataFim(dto.getDataFim())
                    .build();
            if ("lido".equals(dto.getStatus()) && leitura.getDataFim() == null) {
                leitura.setDataFim(LocalDate.now());
            }
        }

        leitura = leituraRepository.save(leitura);
        estatisticaService.atualizarContadores(dto.getIdUsuario());
        metaLeituraService.recalcularProgresso(dto.getIdUsuario());
        return toResponseDTO(leitura);
    }

    @Transactional
    public LeituraResponseDTO atualizar(Integer id, LeituraRequestDTO dto) {
        Leitura leitura = leituraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leitura não encontrada: " + id));

        if (dto.getStatus() != null) leitura.setStatus(dto.getStatus());
        if (dto.getDataInicio() != null) leitura.setDataInicio(dto.getDataInicio());
        if (dto.getDataFim() != null) leitura.setDataFim(dto.getDataFim());
        if ("lido".equals(dto.getStatus()) && leitura.getDataFim() == null) {
            leitura.setDataFim(LocalDate.now());
        }

        leitura = leituraRepository.save(leitura);
        Integer usuarioId = leitura.getUsuario().getId();
        estatisticaService.atualizarContadores(usuarioId);
        metaLeituraService.recalcularProgresso(usuarioId);
        return toResponseDTO(leitura);
    }

    @Transactional(readOnly = true)
    public Optional<LeituraResponseDTO> buscarPorUsuarioELivro(Integer usuarioId, Integer livroId) {
        return leituraRepository.findByUsuarioIdAndLivroId(usuarioId, livroId)
                .map(this::toResponseDTO);
    }

    private LeituraResponseDTO toResponseDTO(Leitura leitura) {
        return LeituraResponseDTO.builder()
                .id(leitura.getId())
                .idUsuario(leitura.getUsuario().getId())
                .nomeUsuario(leitura.getUsuario().getNome())
                .idLivro(leitura.getLivro().getId())
                .tituloLivro(leitura.getLivro().getTitulo())
                .status(leitura.getStatus())
                .dataInicio(leitura.getDataInicio())
                .dataFim(leitura.getDataFim())
                .build();
    }
}
