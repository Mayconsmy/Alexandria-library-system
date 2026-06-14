package br.edu.clubeleitura.repository;

import br.edu.clubeleitura.model.Reacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReacaoRepository extends JpaRepository<Reacao, Integer> {
    Optional<Reacao> findByUsuarioIdAndResenhaId(Integer usuarioId, Integer resenhaId);
    long countByResenhaId(Integer resenhaId);
}
