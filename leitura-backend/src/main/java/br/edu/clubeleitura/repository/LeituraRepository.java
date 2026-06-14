package br.edu.clubeleitura.repository;

import br.edu.clubeleitura.model.Leitura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeituraRepository extends JpaRepository<Leitura, Integer> {
    List<Leitura> findByUsuarioId(Integer usuarioId);
    Optional<Leitura> findByUsuarioIdAndLivroId(Integer usuarioId, Integer livroId);
    long countByUsuarioIdAndStatus(Integer usuarioId, String status);
}
