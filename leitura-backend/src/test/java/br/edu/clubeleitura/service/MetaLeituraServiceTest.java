package br.edu.clubeleitura.service;

import br.edu.clubeleitura.dto.request.MetaRequestDTO;
import br.edu.clubeleitura.dto.response.MetaResponseDTO;
import br.edu.clubeleitura.exception.ResourceNotFoundException;
import br.edu.clubeleitura.model.MetaLeitura;
import br.edu.clubeleitura.model.Usuario;
import br.edu.clubeleitura.repository.MetaLeituraRepository;
import br.edu.clubeleitura.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MetaLeituraServiceTest {

    @Mock
    private MetaLeituraRepository metaRepository;
    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private MetaLeituraService metaService;

    private Usuario usuario;
    private MetaLeitura meta;

    @BeforeEach
    void setUp() {
        usuario = Usuario.builder().id(1).nome("Teste").email("teste@email.com").build();
        meta = MetaLeitura.builder()
                .id(1)
                .usuario(usuario)
                .quantidadeLivros(12)
                .prazo(LocalDateTime.now().plusMonths(6))
                .progresso(0)
                .build();
    }

    @Test
    void listarPorUsuario_deveRetornarListaDeMetas() {
        when(metaRepository.findByUsuarioId(1)).thenReturn(List.of(meta));

        List<MetaResponseDTO> result = metaService.listarPorUsuario(1);

        assertEquals(1, result.size());
        assertEquals(12, result.get(0).getQuantidadeLivros());
        verify(metaRepository).findByUsuarioId(1);
    }

    @Test
    void criar_comDadosValidos_deveCriarMeta() {
        MetaRequestDTO dto = new MetaRequestDTO(1, 12, LocalDateTime.now().plusMonths(6));

        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));
        when(metaRepository.save(any(MetaLeitura.class))).thenReturn(meta);

        MetaResponseDTO result = metaService.criar(dto);

        assertNotNull(result);
        assertEquals(12, result.getQuantidadeLivros());
        assertEquals(0, result.getProgresso());
        verify(metaRepository).save(any(MetaLeitura.class));
    }

    @Test
    void criar_comUsuarioInexistente_deveLancarResourceNotFoundException() {
        MetaRequestDTO dto = new MetaRequestDTO(99, 12, LocalDateTime.now().plusMonths(6));

        when(usuarioRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> metaService.criar(dto));
        verify(metaRepository, never()).save(any());
    }

    @Test
    void criar_metaComPrazoNoPassado_deveCriarNormalmente() {
        LocalDateTime prazoPassado = LocalDateTime.now().minusDays(1);
        MetaRequestDTO dto = new MetaRequestDTO(1, 5, prazoPassado);

        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));

        MetaLeitura metaPassado = MetaLeitura.builder()
                .id(2)
                .usuario(usuario)
                .quantidadeLivros(5)
                .prazo(prazoPassado)
                .progresso(0)
                .build();

        when(metaRepository.save(any(MetaLeitura.class))).thenReturn(metaPassado);

        MetaResponseDTO result = metaService.criar(dto);

        assertNotNull(result);
        assertEquals(5, result.getQuantidadeLivros());
        assertTrue(result.getPrazo().isBefore(LocalDateTime.now()));
        verify(metaRepository).save(any(MetaLeitura.class));
    }
}
