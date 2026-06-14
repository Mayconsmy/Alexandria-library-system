package br.edu.clubeleitura.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class LeituraResponseDTO {
    private Integer id;
    private Integer idUsuario;
    private String nomeUsuario;
    private Integer idLivro;
    private String tituloLivro;
    private String status;
    private LocalDate dataInicio;
    private LocalDate dataFim;
}
