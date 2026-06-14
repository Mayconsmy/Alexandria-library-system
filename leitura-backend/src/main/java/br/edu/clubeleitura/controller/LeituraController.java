package br.edu.clubeleitura.controller;

import br.edu.clubeleitura.dto.request.LeituraRequestDTO;
import br.edu.clubeleitura.dto.response.LeituraResponseDTO;
import br.edu.clubeleitura.service.LeituraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leituras")
@RequiredArgsConstructor
public class LeituraController {

    private final LeituraService leituraService;

    @GetMapping("/usuario/{id}")
    public ResponseEntity<Map<String, Object>> listarPorUsuario(@PathVariable Integer id) {
        List<LeituraResponseDTO> leituras = leituraService.listarPorUsuario(id);
        return ResponseEntity.ok(Map.of("status", "success", "data", leituras));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> registrar(@Valid @RequestBody LeituraRequestDTO dto) {
        LeituraResponseDTO leitura = leituraService.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("status", "success", "data", leitura));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> atualizar(@PathVariable Integer id,
                                                          @Valid @RequestBody LeituraRequestDTO dto) {
        LeituraResponseDTO leitura = leituraService.atualizar(id, dto);
        return ResponseEntity.ok(Map.of("status", "success", "data", leitura));
    }
}
