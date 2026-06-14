package br.edu.clubeleitura.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ResenhaRequestDTO {

    @NotNull(message = "ID do usuário é obrigatório")
    private Integer idUsuario;

    @NotNull(message = "ID do livro é obrigatório")
    private Integer idLivro;

    @NotBlank(message = "Texto da resenha é obrigatório")
    private String texto;

    @Min(value = 0, message = "Nota mínima é 0")
    @Max(value = 5, message = "Nota máxima é 5")
    private Float nota;
}
