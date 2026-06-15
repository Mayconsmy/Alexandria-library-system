package br.edu.clubeleitura.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "meta_leitura")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class MetaLeitura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_meta")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "quantidade_livros", nullable = false)
    private Integer quantidadeLivros;

    @Column(nullable = false)
    private LocalDate prazo;

    @Column
    @Builder.Default
    private Integer progresso = 0;
}
