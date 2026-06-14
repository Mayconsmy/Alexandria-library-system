package br.edu.clubeleitura.repository;

import br.edu.clubeleitura.model.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MensagemRepository extends JpaRepository<Mensagem, Integer> {
    List<Mensagem> findByGrupoIdOrderByDataEnvioAsc(Integer grupoId);
}
