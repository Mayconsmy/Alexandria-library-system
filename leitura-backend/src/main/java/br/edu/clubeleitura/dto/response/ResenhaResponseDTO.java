package br.edu.clubeleitura.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ResenhaResponseDTO {
    private Integer id;
    private Integer idUsuario;
    private String nomeUsuario;
    private Integer idLivro;
    private String tituloLivro;
    private String texto;
    private Float nota;
    private LocalDate data;
    private Long qtdReacoes;
}
