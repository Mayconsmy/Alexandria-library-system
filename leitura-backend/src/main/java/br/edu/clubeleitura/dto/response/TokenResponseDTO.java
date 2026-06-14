package br.edu.clubeleitura.dto.response;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TokenResponseDTO {
    private String token;
    private String tipo;
    private String email;
    private String nome;
    private Integer id;
}
