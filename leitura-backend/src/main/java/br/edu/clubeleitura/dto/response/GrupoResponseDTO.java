package br.edu.clubeleitura.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class GrupoResponseDTO {
    private Integer id;
    private String nome;
    private String descricao;
    private Boolean privado;
    private LocalDate dataCriacao;
    private String adminNome;
    private Integer qtdMembros;
}
