package br.edu.clubeleitura.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "grupo_leitura")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class GrupoLeitura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_grupo")
    private Integer id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(length = 500)
    private String descricao;

    @Column
    @Builder.Default
    private Boolean privado = false;

    @Column(name = "data_criacao", nullable = false)
    @Builder.Default
    private LocalDate dataCriacao = LocalDate.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario admin;

    @OneToMany(mappedBy = "grupo", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UsuarioGrupo> membros = new ArrayList<>();

    @OneToMany(mappedBy = "grupo", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Mensagem> mensagens = new ArrayList<>();
}
