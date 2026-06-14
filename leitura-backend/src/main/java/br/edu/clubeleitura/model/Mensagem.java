package br.edu.clubeleitura.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensagem")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mensagem")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_grupo_leitura", nullable = false)
    private GrupoLeitura grupo;

    @Column(nullable = false, length = 1000)
    private String conteudo;

    @Column(name = "data_envio", nullable = false)
    @Builder.Default
    private LocalDateTime dataEnvio = LocalDateTime.now();
}
