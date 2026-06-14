package br.edu.clubeleitura.service;

import br.edu.clubeleitura.dto.response.EstatisticaResponseDTO;
import br.edu.clubeleitura.exception.ResourceNotFoundException;
import br.edu.clubeleitura.model.Estatistica;
import br.edu.clubeleitura.repository.EstatisticaRepository;
import br.edu.clubeleitura.repository.LeituraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EstatisticaService {

    private final EstatisticaRepository estatisticaRepository;
    private final LeituraRepository leituraRepository;

    public EstatisticaResponseDTO buscarPorUsuario(Integer usuarioId) {
        Estatistica estatistica = estatisticaRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Estatísticas não encontradas para o usuário: " + usuarioId));

        return toResponseDTO(estatistica);
    }

    @Transactional
    public void atualizarContadores(Integer usuarioId) {
        Estatistica estatistica = estatisticaRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Estatísticas não encontradas"));

        long lidos = leituraRepository.countByUsuarioIdAndStatus(usuarioId, "lido");
        long lendo = leituraRepository.countByUsuarioIdAndStatus(usuarioId, "lendo");
        long desejados = leituraRepository.countByUsuarioIdAndStatus(usuarioId, "quero_ler");

        estatistica.setLivrosLidos((int) lidos);
        estatistica.setLivrosEmLeitura((int) lendo);
        estatistica.setLivrosDesejados((int) desejados);

        estatisticaRepository.save(estatistica);
    }

    private EstatisticaResponseDTO toResponseDTO(Estatistica estatistica) {
        return EstatisticaResponseDTO.builder()
                .id(estatistica.getId())
                .idUsuario(estatistica.getUsuario().getId())
                .livrosLidos(estatistica.getLivrosLidos())
                .livrosEmLeitura(estatistica.getLivrosEmLeitura())
                .livrosDesejados(estatistica.getLivrosDesejados())
                .build();
    }
}
