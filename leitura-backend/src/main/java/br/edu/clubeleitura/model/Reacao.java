package br.edu.clubeleitura.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "reacao")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Reacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reacao")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_resenha", nullable = false)
    private Resenha resenha;

    @Column(nullable = false, length = 30)
    private String tipo;

    @Column(nullable = false)
    @Builder.Default
    private LocalDate data = LocalDate.now();
}
