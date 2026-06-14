package br.edu.clubeleitura.repository;

import br.edu.clubeleitura.model.Resenha;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResenhaRepository extends JpaRepository<Resenha, Integer> {
    List<Resenha> findByLivroId(Integer livroId);
    List<Resenha> findByUsuarioId(Integer usuarioId);
}
