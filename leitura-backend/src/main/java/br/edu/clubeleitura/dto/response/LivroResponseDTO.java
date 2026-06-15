package br.edu.clubeleitura.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class LivroResponseDTO {
    private Integer id;
    private String titulo;
    private String autor;
    private String genero;
    private String descricao;
    private String editora;
    private String tipo;
    private LocalDate dataPublicacao;
}
