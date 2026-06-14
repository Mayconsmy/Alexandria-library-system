package br.edu.clubeleitura.controller;

import br.edu.clubeleitura.dto.response.NotificacaoResponseDTO;
import br.edu.clubeleitura.service.NotificacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificacoes")
@RequiredArgsConstructor
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    @GetMapping("/usuario/{id}")
    public ResponseEntity<Map<String, Object>> listar(@PathVariable Integer id) {
        List<NotificacaoResponseDTO> notificacoes = notificacaoService.listarPorUsuario(id);
        return ResponseEntity.ok(Map.of("status", "success", "data", notificacoes));
    }

    @PutMapping("/{id}/lida")
    public ResponseEntity<Map<String, Object>> marcarLida(@PathVariable Integer id) {
        notificacaoService.marcarComoLida(id);
        return ResponseEntity.ok(Map.of("status", "success", "data", "Notificação marcada como lida"));
    }
}
