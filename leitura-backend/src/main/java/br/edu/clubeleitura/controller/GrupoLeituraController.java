package br.edu.clubeleitura.controller;

import br.edu.clubeleitura.dto.request.GrupoRequestDTO;
import br.edu.clubeleitura.dto.response.GrupoResponseDTO;
import br.edu.clubeleitura.service.GrupoLeituraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/grupos")
@RequiredArgsConstructor
public class GrupoLeituraController {

    private final GrupoLeituraService grupoService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> listar(@RequestParam(required = false) String nome) {
        List<GrupoResponseDTO> grupos = grupoService.listar(nome);
        return ResponseEntity.ok(Map.of("status", "success", "data", grupos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> buscarPorId(@PathVariable Integer id) {
        GrupoResponseDTO grupo = grupoService.buscarPorId(id);
        return ResponseEntity.ok(Map.of("status", "success", "data", grupo));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> criar(@Valid @RequestBody GrupoRequestDTO dto) {
        GrupoResponseDTO grupo = grupoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("status", "success", "data", grupo));
    }

    @PostMapping("/{id}/entrar")
    public ResponseEntity<Map<String, Object>> entrar(@PathVariable Integer id,
                                                       @RequestBody Map<String, Integer> body) {
        grupoService.entrar(id, body.get("idUsuario"));
        return ResponseEntity.ok(Map.of("status", "success", "data", "Ingresso realizado com sucesso"));
    }

    @PostMapping("/{id}/sair")
    public ResponseEntity<Map<String, Object>> sair(@PathVariable Integer id,
                                                     @RequestBody Map<String, Integer> body) {
        grupoService.sair(id, body.get("idUsuario"));
        return ResponseEntity.ok(Map.of("status", "success", "data", "Saída realizada com sucesso"));
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<Map<String, Object>> listarPorUsuario(@PathVariable Integer id) {
        List<GrupoResponseDTO> grupos = grupoService.listarPorUsuario(id);
        return ResponseEntity.ok(Map.of("status", "success", "data", grupos));
    }

    @GetMapping("/{id}/membro/{usuarioId}")
    public ResponseEntity<Map<String, Object>> isMembro(@PathVariable Integer id,
                                                         @PathVariable Integer usuarioId) {
        boolean membro = grupoService.isMembro(id, usuarioId);
        return ResponseEntity.ok(Map.of("status", "success", "data", membro));
    }
}
