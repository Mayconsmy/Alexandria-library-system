package br.edu.clubeleitura.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuario_grupo")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class UsuarioGrupo {

    @EmbeddedId
    private UsuarioGrupoId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idUsuario")
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idGrupoLeitura")
    @JoinColumn(name = "id_grupo_leitura")
    private GrupoLeitura grupo;
}
