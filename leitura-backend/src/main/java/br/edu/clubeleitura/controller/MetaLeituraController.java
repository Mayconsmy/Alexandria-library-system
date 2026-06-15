package br.edu.clubeleitura.controller;

import br.edu.clubeleitura.dto.request.MetaRequestDTO;
import br.edu.clubeleitura.dto.response.MetaResponseDTO;
import br.edu.clubeleitura.service.MetaLeituraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/metas")
@RequiredArgsConstructor
public class MetaLeituraController {

    private final MetaLeituraService metaService;

    @GetMapping("/usuario/{id}")
    public ResponseEntity<Map<String, Object>> listarPorUsuario(@PathVariable Integer id) {
        List<MetaResponseDTO> metas = metaService.listarPorUsuario(id);
        return ResponseEntity.ok(Map.of("status", "success", "data", metas));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> criar(@Valid @RequestBody MetaRequestDTO dto) {
        MetaResponseDTO meta = metaService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("status", "success", "data", meta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> atualizar(@PathVariable Integer id,
                                                          @Valid @RequestBody MetaRequestDTO dto) {
        MetaResponseDTO meta = metaService.atualizar(id, dto);
        return ResponseEntity.ok(Map.of("status", "success", "data", meta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletar(@PathVariable Integer id) {
        metaService.deletar(id);
        return ResponseEntity.ok(Map.of("status", "success", "data", "Meta removida com sucesso"));
    }
}
