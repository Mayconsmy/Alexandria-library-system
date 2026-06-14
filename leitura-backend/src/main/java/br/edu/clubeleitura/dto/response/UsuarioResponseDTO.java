package br.edu.clubeleitura.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class UsuarioResponseDTO {
    private Integer id;
    private String nome;
    private String email;
    private String fotoPerfil;
    private String tipoPerfil;
    private LocalDate dataCadastro;
}
