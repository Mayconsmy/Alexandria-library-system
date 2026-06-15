package br.edu.clubeleitura.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class MetaResponseDTO {
    private Integer id;
    private Integer idUsuario;
    private String nomeUsuario;
    private Integer quantidadeLivros;
    private LocalDate prazo;
    private Integer progresso;
}
