package br.edu.clubeleitura.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class LeituraRequestDTO {

    private Integer idUsuario;

    private Integer idLivro;

    @NotBlank(message = "Status é obrigatório")
    private String status;

    private LocalDate dataInicio;
    private LocalDate dataFim;
}
