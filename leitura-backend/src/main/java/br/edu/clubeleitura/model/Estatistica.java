package br.edu.clubeleitura.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "estatistica")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Estatistica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estatistica")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "livros_lidos")
    @Builder.Default
    private Integer livrosLidos = 0;

    @Column(name = "livros_em_leitura")
    @Builder.Default
    private Integer livrosEmLeitura = 0;

    @Column(name = "livros_desejados")
    @Builder.Default
    private Integer livrosDesejados = 0;

    @Column(name = "livros_abandonados")
    @Builder.Default
    private Integer livrosAbandonados = 0;

    @Column(name = "livros_relendo")
    @Builder.Default
    private Integer livrosRelendo = 0;

    @Column(name = "total_avaliacoes")
    @Builder.Default
    private Integer totalAvaliacoes = 0;

    @Column(name = "media_avaliacoes")
    @Builder.Default
    private Double mediaAvaliacoes = 0.0;
}
