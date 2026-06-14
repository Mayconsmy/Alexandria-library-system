package br.edu.clubeleitura.repository;

import br.edu.clubeleitura.model.GrupoLeitura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrupoLeituraRepository extends JpaRepository<GrupoLeitura, Integer> {
    List<GrupoLeitura> findByNomeContainingIgnoreCase(String nome);
}
