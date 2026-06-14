package br.edu.clubeleitura.controller;

import br.edu.clubeleitura.dto.response.EstatisticaResponseDTO;
import br.edu.clubeleitura.service.EstatisticaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/estatisticas")
@RequiredArgsConstructor
public class EstatisticaController {

    private final EstatisticaService estatisticaService;

    @GetMapping("/usuario/{id}")
    public ResponseEntity<Map<String, Object>> buscar(@PathVariable Integer id) {
        EstatisticaResponseDTO estatisticas = estatisticaService.buscarPorUsuario(id);
        return ResponseEntity.ok(Map.of("status", "success", "data", estatisticas));
    }
}
