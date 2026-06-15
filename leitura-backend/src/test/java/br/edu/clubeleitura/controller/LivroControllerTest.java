package br.edu.clubeleitura.controller;

import br.edu.clubeleitura.dto.request.LivroRequestDTO;
import br.edu.clubeleitura.dto.response.LivroResponseDTO;
import br.edu.clubeleitura.exception.ResourceNotFoundException;
import br.edu.clubeleitura.service.LivroService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LivroController.class)
class LivroControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private LivroService livroService;

    @Test
    void listar_deveRetornarListaDeLivros() throws Exception {
        LivroResponseDTO livro = LivroResponseDTO.builder()
                .id(1)
                .titulo("Dom Casmurro")
                .autor("Machado de Assis")
                .genero("Romance")
                .tipo("livro")
                .build();

        when(livroService.listar(null, null, null, null, null, null)).thenReturn(List.of(livro));

        mockMvc.perform(get("/api/livros"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data[0].titulo").value("Dom Casmurro"));
    }

    @Test
    void listar_comFiltroTitulo_deveFiltrarResultados() throws Exception {
        LivroResponseDTO livro = LivroResponseDTO.builder()
                .id(1)
                .titulo("Dom Casmurro")
                .autor("Machado de Assis")
                .build();

        when(livroService.listar(eq("Dom"), isNull(), isNull(), isNull(), isNull(), isNull())).thenReturn(List.of(livro));

        mockMvc.perform(get("/api/livros?titulo=Dom"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].titulo").value("Dom Casmurro"));
    }

    @Test
    void buscarPorId_comIdExistente_deveRetornarLivro() throws Exception {
        LivroResponseDTO livro = LivroResponseDTO.builder()
                .id(1)
                .titulo("Dom Casmurro")
                .autor("Machado de Assis")
                .build();

        when(livroService.buscarPorId(1)).thenReturn(livro);

        mockMvc.perform(get("/api/livros/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.titulo").value("Dom Casmurro"));
    }

    @Test
    void buscarPorId_comIdInexistente_deveRetornar404() throws Exception {
        when(livroService.buscarPorId(99)).thenThrow(new ResourceNotFoundException("Livro não encontrado: 99"));

        mockMvc.perform(get("/api/livros/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value("error"));
    }

    @Test
    void criar_comDadosValidos_deveRetornar201() throws Exception {
        LivroResponseDTO response = LivroResponseDTO.builder()
                .id(1)
                .titulo("Novo Livro")
                .autor("Novo Autor")
                .genero("Ficção")
                .tipo("livro")
                .dataPublicacao(LocalDate.of(2024, 1, 1))
                .build();

        when(livroService.criar(any(LivroRequestDTO.class))).thenReturn(response);

        LivroRequestDTO request = new LivroRequestDTO("Novo Livro", "Novo Autor", "Ficção",
                "Descrição", null, "livro", LocalDate.of(2024, 1, 1));

        mockMvc.perform(post("/api/livros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.titulo").value("Novo Livro"));
    }

    @Test
    void criar_comDadosInvalidos_deveRetornar400() throws Exception {
        LivroRequestDTO request = new LivroRequestDTO("", "", null, null, null, null, null);

        mockMvc.perform(post("/api/livros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
