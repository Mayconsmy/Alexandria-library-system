package br.edu.clubeleitura.repository;

import br.edu.clubeleitura.model.MetaLeitura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MetaLeituraRepository extends JpaRepository<MetaLeitura, Integer> {
    List<MetaLeitura> findByUsuarioId(Integer usuarioId);
}
