package br.edu.clubeleitura.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class MensagemResponseDTO {
    private Integer id;
    private Integer idUsuario;
    private String nomeUsuario;
    private Integer idGrupo;
    private String conteudo;
    private LocalDateTime dataEnvio;
}
