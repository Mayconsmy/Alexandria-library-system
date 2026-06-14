package br.edu.clubeleitura.service;

import br.edu.clubeleitura.dto.request.LivroRequestDTO;
import br.edu.clubeleitura.dto.response.LivroResponseDTO;
import br.edu.clubeleitura.exception.ResourceNotFoundException;
import br.edu.clubeleitura.model.Livro;
import br.edu.clubeleitura.repository.LivroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LivroService {

    private final LivroRepository livroRepository;

    public List<LivroResponseDTO> listar(String titulo, String autor, String genero) {
        List<Livro> livros;
        if (titulo != null) {
            livros = livroRepository.findByTituloContainingIgnoreCase(titulo);
        } else if (autor != null) {
            livros = livroRepository.findByAutorContainingIgnoreCase(autor);
        } else if (genero != null) {
            livros = livroRepository.findByGeneroContainingIgnoreCase(genero);
        } else {
            livros = livroRepository.findAll();
        }
        return livros.stream().map(this::toResponseDTO).toList();
    }

    public LivroResponseDTO buscarPorId(Integer id) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado: " + id));
        return toResponseDTO(livro);
    }

    @Transactional
    public LivroResponseDTO criar(LivroRequestDTO dto) {
        Livro livro = Livro.builder()
                .titulo(dto.getTitulo())
                .autor(dto.getAutor())
                .genero(dto.getGenero())
                .descricao(dto.getDescricao())
                .tipo(dto.getTipo() != null ? dto.getTipo() : "livro")
                .dataPublicacao(dto.getDataPublicacao())
                .build();
        livro = livroRepository.save(livro);
        return toResponseDTO(livro);
    }

    @Transactional
    public LivroResponseDTO atualizar(Integer id, LivroRequestDTO dto) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado: " + id));

        if (dto.getTitulo() != null) livro.setTitulo(dto.getTitulo());
        if (dto.getAutor() != null) livro.setAutor(dto.getAutor());
        if (dto.getGenero() != null) livro.setGenero(dto.getGenero());
        if (dto.getDescricao() != null) livro.setDescricao(dto.getDescricao());
        if (dto.getTipo() != null) livro.setTipo(dto.getTipo());
        if (dto.getDataPublicacao() != null) livro.setDataPublicacao(dto.getDataPublicacao());

        livro = livroRepository.save(livro);
        return toResponseDTO(livro);
    }

    @Transactional
    public void deletar(Integer id) {
        if (!livroRepository.existsById(id)) {
            throw new ResourceNotFoundException("Livro não encontrado: " + id);
        }
        livroRepository.deleteById(id);
    }

    private LivroResponseDTO toResponseDTO(Livro livro) {
        return LivroResponseDTO.builder()
                .id(livro.getId())
                .titulo(livro.getTitulo())
                .autor(livro.getAutor())
                .genero(livro.getGenero())
                .descricao(livro.getDescricao())
                .tipo(livro.getTipo())
                .dataPublicacao(livro.getDataPublicacao())
                .build();
    }
}
