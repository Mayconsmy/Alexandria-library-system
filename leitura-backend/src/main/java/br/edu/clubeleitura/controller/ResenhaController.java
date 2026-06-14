package br.edu.clubeleitura.controller;

import br.edu.clubeleitura.dto.request.ResenhaRequestDTO;
import br.edu.clubeleitura.dto.response.ResenhaResponseDTO;
import br.edu.clubeleitura.service.ResenhaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resenhas")
@RequiredArgsConstructor
public class ResenhaController {

    private final ResenhaService resenhaService;

    @GetMapping("/livro/{id}")
    public ResponseEntity<Map<String, Object>> listarPorLivro(@PathVariable Integer id) {
        List<ResenhaResponseDTO> resenhas = resenhaService.listarPorLivro(id);
        return ResponseEntity.ok(Map.of("status", "success", "data", resenhas));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> criar(@Valid @RequestBody ResenhaRequestDTO dto) {
        ResenhaResponseDTO resenha = resenhaService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("status", "success", "data", resenha));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> atualizar(@PathVariable Integer id,
                                                          @Valid @RequestBody ResenhaRequestDTO dto) {
        ResenhaResponseDTO resenha = resenhaService.atualizar(id, dto);
        return ResponseEntity.ok(Map.of("status", "success", "data", resenha));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletar(@PathVariable Integer id) {
        resenhaService.deletar(id);
        return ResponseEntity.ok(Map.of("status", "success", "data", "Resenha removida com sucesso"));
    }
}
