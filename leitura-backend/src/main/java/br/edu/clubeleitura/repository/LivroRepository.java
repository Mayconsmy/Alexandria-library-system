package br.edu.clubeleitura.repository;

import br.edu.clubeleitura.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LivroRepository extends JpaRepository<Livro, Integer> {

    @Query(value = "SELECT * FROM livro WHERE " +
           "(:busca IS NULL OR LOWER(titulo) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "LOWER(autor) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "LOWER(genero) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "LOWER(editora) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "LOWER(descricao) LIKE LOWER(CONCAT('%', :busca, '%')))", nativeQuery = true)
    List<Livro> findBySearchTerm(@Param("busca") String busca);

    @Query(value = "SELECT * FROM livro WHERE " +
           "(:titulo IS NULL OR LOWER(titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))) AND " +
           "(:autor IS NULL OR LOWER(autor) LIKE LOWER(CONCAT('%', :autor, '%'))) AND " +
           "(:genero IS NULL OR LOWER(genero) LIKE LOWER(CONCAT('%', :genero, '%'))) AND " +
           "(:editora IS NULL OR LOWER(editora) LIKE LOWER(CONCAT('%', :editora, '%'))) AND " +
           "(:descricao IS NULL OR LOWER(descricao) LIKE LOWER(CONCAT('%', :descricao, '%')))", nativeQuery = true)
    List<Livro> findByFilters(@Param("titulo") String titulo, @Param("autor") String autor,
                              @Param("genero") String genero, @Param("editora") String editora,
                              @Param("descricao") String descricao);

    List<Livro> findByTituloContainingIgnoreCase(String titulo);
    List<Livro> findByAutorContainingIgnoreCase(String autor);
    List<Livro> findByGeneroContainingIgnoreCase(String genero);
}
