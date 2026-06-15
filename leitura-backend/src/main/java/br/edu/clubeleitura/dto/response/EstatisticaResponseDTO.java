package br.edu.clubeleitura.dto.response;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class EstatisticaResponseDTO {
    private Integer id;
    private Integer idUsuario;
    private Integer livrosLidos;
    private Integer livrosEmLeitura;
    private Integer livrosDesejados;
    private Integer livrosAbandonados;
    private Integer livrosRelendo;
    private Integer totalAvaliacoes;
    private Double mediaAvaliacoes;
}
