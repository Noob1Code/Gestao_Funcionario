/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.senai.gestaofuncionarios.repository;

import com.senai.gestaofuncionarios.model.Funcionario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Aluno
 */
@Repository
public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    Optional<Funcionario> findById(Long id);

    boolean existsByEmail(String email);

    List<Funcionario> findByCargoAndAtivoOrderByNome(String cargo, Boolean ativo);

    List<Funcionario> findByCargoOrderByNome(String cargo);

    List<Funcionario> findByAtivoOrderByNome(Boolean ativo);

    List<Funcionario> findAllByOrderByNome();

    @Query("SELECT DISTINCT f.cargo FROM Funcionario f ORDER BY f.cargo")
    List<String> findDistinctCargos();
    
    Optional<Funcionario> findByEmail(String email);
}
