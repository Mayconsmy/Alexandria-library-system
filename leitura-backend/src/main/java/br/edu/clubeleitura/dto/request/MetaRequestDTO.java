package br.edu.clubeleitura.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class MetaRequestDTO {
    @NotNull(message = "ID do usuário é obrigatório")
    private Integer idUsuario;

    @Min(value = 1, message = "Quantidade mínima é 1 livro")
    private Integer quantidadeLivros;

    @NotNull(message = "Prazo é obrigatório")
    private LocalDate prazo;
}
