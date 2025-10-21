/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.senai.gestaofuncionarios.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 *
 * @author Aluno
 */
public record FuncionarioResponseDTO(
    Long id, 
    String nome,
    String email,
    String cargo,
    BigDecimal salario,
    LocalDate dataAdmissao,
    Boolean ativo
) {}
