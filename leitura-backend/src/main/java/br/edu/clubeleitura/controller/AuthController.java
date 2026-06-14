package br.edu.clubeleitura.controller;

import br.edu.clubeleitura.dto.request.LoginRequestDTO;
import br.edu.clubeleitura.dto.request.UsuarioRequestDTO;
import br.edu.clubeleitura.dto.response.TokenResponseDTO;
import br.edu.clubeleitura.dto.response.UsuarioResponseDTO;
import br.edu.clubeleitura.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/cadastro")
    public ResponseEntity<Map<String, Object>> cadastrar(@Valid @RequestBody UsuarioRequestDTO dto) {
        UsuarioResponseDTO usuario = authService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("status", "success", "data", usuario));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequestDTO dto) {
        TokenResponseDTO token = authService.login(dto);
        return ResponseEntity.ok(Map.of("status", "success", "data", token));
    }
}
