package br.edu.clubeleitura.service;

import br.edu.clubeleitura.dto.response.UsuarioResponseDTO;
import br.edu.clubeleitura.exception.ResourceNotFoundException;
import br.edu.clubeleitura.model.Usuario;
import br.edu.clubeleitura.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = Usuario.builder()
                .id(1)
                .nome("Teste")
                .email("teste@email.com")
                .senha("encodedSenha")
                .tipoPerfil("leitor")
                .dataCadastro(LocalDate.now())
                .build();
    }

    @Test
    void buscarPorId_comIdExistente_deveRetornarUsuario() {
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));

        UsuarioResponseDTO result = usuarioService.buscarPorId(1);

        assertNotNull(result);
        assertEquals("Teste", result.getNome());
        assertEquals("teste@email.com", result.getEmail());
        verify(usuarioRepository).findById(1);
    }

    @Test
    void buscarPorId_comIdInexistente_deveLancarResourceNotFoundException() {
        when(usuarioRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> usuarioService.buscarPorId(99));
        verify(usuarioRepository).findById(99);
    }

    @Test
    void atualizar_comDadosValidos_deveAtualizarUsuario() {
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        UsuarioResponseDTO dto = UsuarioResponseDTO.builder()
                .nome("Novo Nome")
                .fotoPerfil("nova-foto.jpg")
                .tipoPerfil("autor")
                .build();

        UsuarioResponseDTO result = usuarioService.atualizar(1, dto);

        assertNotNull(result);
        assertEquals("Novo Nome", result.getNome());
        assertEquals("autor", result.getTipoPerfil());
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void atualizar_comIdInexistente_deveLancarResourceNotFoundException() {
        when(usuarioRepository.findById(99)).thenReturn(Optional.empty());

        UsuarioResponseDTO dto = UsuarioResponseDTO.builder().nome("Teste").build();

        assertThrows(ResourceNotFoundException.class, () -> usuarioService.atualizar(99, dto));
        verify(usuarioRepository, never()).save(any());
    }
}
