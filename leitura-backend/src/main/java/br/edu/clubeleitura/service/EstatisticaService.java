package br.edu.clubeleitura.service;

import br.edu.clubeleitura.dto.response.EstatisticaResponseDTO;
import br.edu.clubeleitura.exception.ResourceNotFoundException;
import br.edu.clubeleitura.model.Estatistica;
import br.edu.clubeleitura.repository.EstatisticaRepository;
import br.edu.clubeleitura.repository.LeituraRepository;
import br.edu.clubeleitura.repository.ResenhaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EstatisticaService {

    private final EstatisticaRepository estatisticaRepository;
    private final LeituraRepository leituraRepository;
    private final ResenhaRepository resenhaRepository;

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
        long abandonados = leituraRepository.countByUsuarioIdAndStatus(usuarioId, "abandonado");
        long relendo = leituraRepository.countByUsuarioIdAndStatus(usuarioId, "relendo");

        Double media = resenhaRepository.mediaAvaliacoesPorUsuario(usuarioId);
        Long totalAval = resenhaRepository.countAvaliacoesPorUsuario(usuarioId);

        estatistica.setLivrosLidos((int) lidos);
        estatistica.setLivrosEmLeitura((int) lendo);
        estatistica.setLivrosDesejados((int) desejados);
        estatistica.setLivrosAbandonados((int) abandonados);
        estatistica.setLivrosRelendo((int) relendo);
        estatistica.setTotalAvaliacoes(totalAval != null ? totalAval.intValue() : 0);
        estatistica.setMediaAvaliacoes(media != null ? media : 0.0);

        estatisticaRepository.save(estatistica);
    }

    private EstatisticaResponseDTO toResponseDTO(Estatistica estatistica) {
        return EstatisticaResponseDTO.builder()
                .id(estatistica.getId())
                .idUsuario(estatistica.getUsuario().getId())
                .livrosLidos(estatistica.getLivrosLidos())
                .livrosEmLeitura(estatistica.getLivrosEmLeitura())
                .livrosDesejados(estatistica.getLivrosDesejados())
                .livrosAbandonados(estatistica.getLivrosAbandonados())
                .livrosRelendo(estatistica.getLivrosRelendo())
                .totalAvaliacoes(estatistica.getTotalAvaliacoes())
                .mediaAvaliacoes(estatistica.getMediaAvaliacoes())
                .build();
    }
}
