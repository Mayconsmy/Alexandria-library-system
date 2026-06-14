package br.edu.clubeleitura.repository;

import br.edu.clubeleitura.model.Estatistica;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstatisticaRepository extends JpaRepository<Estatistica, Integer> {
    Optional<Estatistica> findByUsuarioId(Integer usuarioId);
}
