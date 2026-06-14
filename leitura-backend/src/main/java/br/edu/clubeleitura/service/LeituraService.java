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

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeituraService {

    private final LeituraRepository leituraRepository;
    private final UsuarioRepository usuarioRepository;
    private final LivroRepository livroRepository;

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

        Leitura leitura = Leitura.builder()
                .usuario(usuario)
                .livro(livro)
                .status(dto.getStatus())
                .dataInicio(dto.getDataInicio())
                .dataFim(dto.getDataFim())
                .build();

        leitura = leituraRepository.save(leitura);
        return toResponseDTO(leitura);
    }

    @Transactional
    public LeituraResponseDTO atualizar(Integer id, LeituraRequestDTO dto) {
        Leitura leitura = leituraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leitura não encontrada: " + id));

        if (dto.getStatus() != null) leitura.setStatus(dto.getStatus());
        if (dto.getDataInicio() != null) leitura.setDataInicio(dto.getDataInicio());
        if (dto.getDataFim() != null) leitura.setDataFim(dto.getDataFim());

        leitura = leituraRepository.save(leitura);
        return toResponseDTO(leitura);
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
