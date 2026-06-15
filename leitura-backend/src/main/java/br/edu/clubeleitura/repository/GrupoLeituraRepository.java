package br.edu.clubeleitura.repository;

import br.edu.clubeleitura.model.GrupoLeitura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GrupoLeituraRepository extends JpaRepository<GrupoLeitura, Integer> {
    List<GrupoLeitura> findByNomeContainingIgnoreCase(String nome);

    @Query("SELECT g FROM GrupoLeitura g JOIN g.membros m WHERE m.usuario.id = :usuarioId")
    List<GrupoLeitura> findByUsuarioId(@Param("usuarioId") Integer usuarioId);
}
