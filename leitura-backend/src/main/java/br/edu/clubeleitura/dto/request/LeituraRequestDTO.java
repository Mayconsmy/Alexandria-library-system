package br.edu.clubeleitura.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class LeituraRequestDTO {

    @NotNull(message = "ID do usuário é obrigatório")
    private Integer idUsuario;

    @NotNull(message = "ID do livro é obrigatório")
    private Integer idLivro;

    @NotNull(message = "Status é obrigatório")
    private String status;

    private LocalDate dataInicio;
    private LocalDate dataFim;
}
