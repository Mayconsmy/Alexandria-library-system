package br.edu.clubeleitura.service;

import br.edu.clubeleitura.dto.request.LeituraRequestDTO;
import br.edu.clubeleitura.dto.response.LeituraResponseDTO;
import br.edu.clubeleitura.exception.ResourceNotFoundException;
import br.edu.clubeleitura.model.Leitura;
import br.edu.clubeleitura.model.Livro;
import br.edu.clubeleitura.model.Usuario;
import br.edu.clubeleitura.repository.LeituraRepository;
import br.edu.clubeleitura.repository.LivroRepository;
import br.edu.clubeleitura.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeituraServiceTest {

    @Mock
    private LeituraRepository leituraRepository;
    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private LivroRepository livroRepository;

    @InjectMocks
    private LeituraService leituraService;

    private Usuario usuario;
    private Livro livro;
    private Leitura leitura;

    @BeforeEach
    void setUp() {
        usuario = Usuario.builder().id(1).nome("Teste").email("teste@email.com").build();
        livro = Livro.builder().id(1).titulo("Livro Teste").autor("Autor Teste").build();
        leitura = Leitura.builder()
                .id(1)
                .usuario(usuario)
                .livro(livro)
                .status("lendo")
                .dataInicio(LocalDate.now())
                .build();
    }

    @Test
    void listarPorUsuario_deveRetornarListaDeLeituras() {
        when(leituraRepository.findByUsuarioId(1)).thenReturn(List.of(leitura));

        List<LeituraResponseDTO> result = leituraService.listarPorUsuario(1);

        assertEquals(1, result.size());
        assertEquals("lendo", result.get(0).getStatus());
        verify(leituraRepository).findByUsuarioId(1);
    }

    @Test
    void registrar_comDadosValidos_deveCriarLeitura() {
        LeituraRequestDTO dto = new LeituraRequestDTO(1, 1, "lendo", LocalDate.now(), null);

        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));
        when(livroRepository.findById(1)).thenReturn(Optional.of(livro));
        when(leituraRepository.save(any(Leitura.class))).thenReturn(leitura);

        LeituraResponseDTO result = leituraService.registrar(dto);

        assertNotNull(result);
        assertEquals("lendo", result.getStatus());
        verify(leituraRepository).save(any(Leitura.class));
    }

    @Test
    void registrar_comUsuarioInexistente_deveLancarResourceNotFoundException() {
        LeituraRequestDTO dto = new LeituraRequestDTO(99, 1, "lendo", LocalDate.now(), null);

        when(usuarioRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> leituraService.registrar(dto));
        verify(leituraRepository, never()).save(any());
    }

    @Test
    void registrar_comLivroInexistente_deveLancarResourceNotFoundException() {
        LeituraRequestDTO dto = new LeituraRequestDTO(1, 99, "lendo", LocalDate.now(), null);

        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));
        when(livroRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> leituraService.registrar(dto));
        verify(leituraRepository, never()).save(any());
    }

    @Test
    void atualizar_comDadosValidos_deveAtualizarLeitura() {
        LeituraRequestDTO dto = new LeituraRequestDTO(null, null, "lido", null, LocalDate.now());

        when(leituraRepository.findById(1)).thenReturn(Optional.of(leitura));
        when(leituraRepository.save(any(Leitura.class))).thenReturn(leitura);

        LeituraResponseDTO result = leituraService.atualizar(1, dto);

        assertNotNull(result);
        verify(leituraRepository).save(any(Leitura.class));
    }

    @Test
    void atualizar_comIdInexistente_deveLancarResourceNotFoundException() {
        LeituraRequestDTO dto = new LeituraRequestDTO(null, null, "lido", null, null);

        when(leituraRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> leituraService.atualizar(99, dto));
        verify(leituraRepository, never()).save(any());
    }
}
