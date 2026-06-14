package br.edu.clubeleitura.repository;

import br.edu.clubeleitura.model.UsuarioGrupo;
import br.edu.clubeleitura.model.UsuarioGrupoId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioGrupoRepository extends JpaRepository<UsuarioGrupo, UsuarioGrupoId> {
}
