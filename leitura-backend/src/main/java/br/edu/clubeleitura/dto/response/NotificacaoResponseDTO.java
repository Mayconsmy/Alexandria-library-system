package br.edu.clubeleitura.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class NotificacaoResponseDTO {
    private Integer id;
    private Integer idUsuario;
    private String mensagem;
    private LocalDateTime data;
    private Boolean lida;
}
