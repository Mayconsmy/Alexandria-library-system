package br.edu.clubeleitura.controller;

import br.edu.clubeleitura.dto.request.LivroRequestDTO;
import br.edu.clubeleitura.dto.response.LivroResponseDTO;
import br.edu.clubeleitura.service.LivroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/livros")
@RequiredArgsConstructor
public class LivroController {

    private final LivroService livroService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> listar(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) String autor,
            @RequestParam(required = false) String genero) {
        List<LivroResponseDTO> livros = livroService.listar(titulo, autor, genero);
        return ResponseEntity.ok(Map.of("status", "success", "data", livros));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> buscarPorId(@PathVariable Integer id) {
        LivroResponseDTO livro = livroService.buscarPorId(id);
        return ResponseEntity.ok(Map.of("status", "success", "data", livro));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> criar(@Valid @RequestBody LivroRequestDTO dto) {
        LivroResponseDTO livro = livroService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("status", "success", "data", livro));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> atualizar(@PathVariable Integer id,
                                                          @Valid @RequestBody LivroRequestDTO dto) {
        LivroResponseDTO livro = livroService.atualizar(id, dto);
        return ResponseEntity.ok(Map.of("status", "success", "data", livro));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletar(@PathVariable Integer id) {
        livroService.deletar(id);
        return ResponseEntity.ok(Map.of("status", "success", "data", "Livro removido com sucesso"));
    }
}
