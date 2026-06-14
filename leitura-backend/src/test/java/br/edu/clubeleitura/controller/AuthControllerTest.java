package br.edu.clubeleitura.controller;

import br.edu.clubeleitura.dto.request.LoginRequestDTO;
import br.edu.clubeleitura.dto.request.UsuarioRequestDTO;
import br.edu.clubeleitura.dto.response.TokenResponseDTO;
import br.edu.clubeleitura.dto.response.UsuarioResponseDTO;
import br.edu.clubeleitura.exception.EmailJaCadastradoException;
import br.edu.clubeleitura.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    void cadastro_comDadosValidos_deveRetornar201() throws Exception {
        UsuarioResponseDTO response = UsuarioResponseDTO.builder()
                .id(1)
                .nome("Novo Usuario")
                .email("novo@email.com")
                .tipoPerfil("leitor")
                .dataCadastro(LocalDate.now())
                .build();

        when(authService.cadastrar(any(UsuarioRequestDTO.class))).thenReturn(response);

        UsuarioRequestDTO request = new UsuarioRequestDTO("Novo Usuario", "novo@email.com", "Senha@123", null, null);

        mockMvc.perform(post("/api/auth/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.nome").value("Novo Usuario"));
    }

    @Test
    void cadastro_comEmailDuplicado_deveRetornar409() throws Exception {
        when(authService.cadastrar(any(UsuarioRequestDTO.class)))
                .thenThrow(new EmailJaCadastradoException("Email já cadastrado: existente@email.com"));

        UsuarioRequestDTO request = new UsuarioRequestDTO("Usuario", "existente@email.com", "Senha@123", null, null);

        mockMvc.perform(post("/api/auth/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value("error"));
    }

    @Test
    void cadastro_comSenhaCurta_deveRetornar400() throws Exception {
        UsuarioRequestDTO request = new UsuarioRequestDTO("Usuario", "email@email.com", "123", null, null);

        mockMvc.perform(post("/api/auth/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_comCredenciaisCorretas_deveRetornarToken() throws Exception {
        TokenResponseDTO token = TokenResponseDTO.builder()
                .token("jwt-token-valido")
                .tipo("Bearer")
                .email("user@email.com")
                .nome("Usuario")
                .id(1)
                .build();

        when(authService.login(any(LoginRequestDTO.class))).thenReturn(token);

        LoginRequestDTO request = new LoginRequestDTO("user@email.com", "Senha@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.token").value("jwt-token-valido"));
    }

    @Test
    void login_comSenhaErrada_deveRetornar401() throws Exception {
        when(authService.login(any(LoginRequestDTO.class)))
                .thenThrow(new BadCredentialsException("Senha inválida"));

        LoginRequestDTO request = new LoginRequestDTO("user@email.com", "senha_errada");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }
}
