package br.edu.clubeleitura.repository;

import br.edu.clubeleitura.model.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificacaoRepository extends JpaRepository<Notificacao, Integer> {
    List<Notificacao> findByUsuarioIdOrderByDataDesc(Integer usuarioId);
    long countByUsuarioIdAndLidaFalse(Integer usuarioId);
}
