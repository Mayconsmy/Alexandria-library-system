package br.edu.clubeleitura.repository;

import br.edu.clubeleitura.model.Resenha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResenhaRepository extends JpaRepository<Resenha, Integer> {
    List<Resenha> findByLivroId(Integer livroId);
    List<Resenha> findByUsuarioId(Integer usuarioId);

    @Query("SELECT AVG(r.nota) FROM Resenha r WHERE r.usuario.id = :usuarioId AND r.nota IS NOT NULL")
    Double mediaAvaliacoesPorUsuario(@Param("usuarioId") Integer usuarioId);

    @Query("SELECT COUNT(r) FROM Resenha r WHERE r.usuario.id = :usuarioId AND r.nota IS NOT NULL")
    Long countAvaliacoesPorUsuario(@Param("usuarioId") Integer usuarioId);

    @Query("SELECT r FROM Resenha r JOIN FETCH r.livro WHERE r.usuario.id = :usuarioId ORDER BY r.data DESC")
    List<Resenha> findByUsuarioIdWithLivro(@Param("usuarioId") Integer usuarioId);
}
