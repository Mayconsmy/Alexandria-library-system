package br.edu.clubeleitura.service;

import br.edu.clubeleitura.dto.request.ResenhaRequestDTO;
import br.edu.clubeleitura.dto.response.ResenhaResponseDTO;
import br.edu.clubeleitura.exception.ResourceNotFoundException;
import br.edu.clubeleitura.model.Livro;
import br.edu.clubeleitura.model.Resenha;
import br.edu.clubeleitura.model.Usuario;
import br.edu.clubeleitura.repository.LivroRepository;
import br.edu.clubeleitura.repository.ReacaoRepository;
import br.edu.clubeleitura.repository.ResenhaRepository;
import br.edu.clubeleitura.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResenhaService {

    private final ResenhaRepository resenhaRepository;
    private final ReacaoRepository reacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final LivroRepository livroRepository;
    private final EstatisticaService estatisticaService;

    public List<ResenhaResponseDTO> listarPorLivro(Integer livroId) {
        return resenhaRepository.findByLivroId(livroId).stream()
                .map(this::toResponseDTO).toList();
    }

    public List<ResenhaResponseDTO> listarPorUsuario(Integer usuarioId, String busca, Integer estrelas) {
        List<Resenha> resenhas = resenhaRepository.findByUsuarioIdWithLivro(usuarioId);
        return resenhas.stream()
                .filter(r -> busca == null || busca.isBlank() ||
                        r.getTexto().toLowerCase().contains(busca.toLowerCase()) ||
                        r.getLivro().getTitulo().toLowerCase().contains(busca.toLowerCase()) ||
                        r.getLivro().getAutor().toLowerCase().contains(busca.toLowerCase()) ||
                        (r.getLivro().getGenero() != null && r.getLivro().getGenero().toLowerCase().contains(busca.toLowerCase())))
                .filter(r -> estrelas == null || (r.getNota() != null && Math.round(r.getNota()) == estrelas))
                .map(this::toResponseDTO).toList();
    }

    @Transactional
    public ResenhaResponseDTO criar(ResenhaRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        Livro livro = livroRepository.findById(dto.getIdLivro())
                .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado"));

        Resenha resenha = Resenha.builder()
                .usuario(usuario)
                .livro(livro)
                .texto(dto.getTexto())
                .nota(dto.getNota())
                .build();

        resenha = resenhaRepository.save(resenha);
        estatisticaService.atualizarContadores(dto.getIdUsuario());
        return toResponseDTO(resenha);
    }

    @Transactional
    public ResenhaResponseDTO atualizar(Integer id, ResenhaRequestDTO dto) {
        Resenha resenha = resenhaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resenha não encontrada: " + id));

        if (dto.getTexto() != null) resenha.setTexto(dto.getTexto());
        if (dto.getNota() != null) resenha.setNota(dto.getNota());

        resenha = resenhaRepository.save(resenha);
        estatisticaService.atualizarContadores(resenha.getUsuario().getId());
        return toResponseDTO(resenha);
    }

    @Transactional
    public void deletar(Integer id) {
        Resenha resenha = resenhaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resenha nao encontrada: " + id));
        Integer usuarioId = resenha.getUsuario().getId();
        resenhaRepository.deleteById(id);
        estatisticaService.atualizarContadores(usuarioId);
    }

    private ResenhaResponseDTO toResponseDTO(Resenha resenha) {
        return ResenhaResponseDTO.builder()
                .id(resenha.getId())
                .idUsuario(resenha.getUsuario().getId())
                .nomeUsuario(resenha.getUsuario().getNome())
                .idLivro(resenha.getLivro().getId())
                .tituloLivro(resenha.getLivro().getTitulo())
                .texto(resenha.getTexto())
                .nota(resenha.getNota())
                .fotoPerfil(resenha.getUsuario().getFotoPerfil())
                .data(resenha.getData())
                .qtdReacoes(reacaoRepository.countByResenhaId(resenha.getId()))
                .build();
    }
}
