package br.edu.clubeleitura.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class GrupoRequestDTO {

    @NotBlank(message = "Nome do grupo é obrigatório")
    private String nome;

    private String descricao;
    private Boolean privado;

    @NotNull(message = "ID do administrador é obrigatório")
    private Integer idAdmin;
}
