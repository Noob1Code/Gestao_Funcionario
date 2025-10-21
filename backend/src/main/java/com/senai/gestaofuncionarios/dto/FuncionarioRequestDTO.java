/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.senai.gestaofuncionarios.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 *
 * @author Aluno
 */
public record FuncionarioRequestDTO(
    @NotBlank(message = "O nome é obrigatório e não pode ser vazio.") 
    @jakarta.validation.constraints.Size(min = 3, message = "O nome deve ter no mínimo 3 caracteres.") 
    String nome,
    
    @NotBlank(message = "O e-mail é obrigatório.") 
    @Email(message = "Formato de e-mail inválido.")
    String email, 
    
    @NotBlank(message = "O cargo é obrigatório e não pode ser vazio.") 
    String cargo,
    
    @NotNull(message = "O salário é obrigatório.")
    @DecimalMin(value = "0.01", message = "O salário deve ser um valor positivo, maior que R$ 0,00. (Regra 3.1)") 
    BigDecimal salario, 
    
    @NotNull(message = "A data de admissão é obrigatória.") 
    LocalDate dataAdmissao 
) {}