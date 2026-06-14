package br.edu.clubeleitura.controller;

import br.edu.clubeleitura.dto.response.MensagemResponseDTO;
import br.edu.clubeleitura.service.MensagemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/grupos/{id}/mensagens")
@RequiredArgsConstructor
public class MensagemController {

    private final MensagemService mensagemService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> listar(@PathVariable Integer id) {
        List<MensagemResponseDTO> mensagens = mensagemService.listarPorGrupo(id);
        return ResponseEntity.ok(Map.of("status", "success", "data", mensagens));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> enviar(@PathVariable Integer id,
                                                       @RequestBody Map<String, Object> body) {
        Integer usuarioId = Integer.valueOf(body.get("idUsuario").toString());
        String conteudo = body.get("conteudo").toString();
        MensagemResponseDTO mensagem = mensagemService.enviar(id, usuarioId, conteudo);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("status", "success", "data", mensagem));
    }
}
