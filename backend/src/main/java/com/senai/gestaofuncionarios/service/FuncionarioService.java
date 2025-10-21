/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.senai.gestaofuncionarios.service;

import com.senai.gestaofuncionarios.dto.FuncionarioRequestDTO;
import com.senai.gestaofuncionarios.dto.FuncionarioResponseDTO;
import com.senai.gestaofuncionarios.mapper.FuncionarioMapper;
import com.senai.gestaofuncionarios.model.Funcionario;
import com.senai.gestaofuncionarios.repository.FuncionarioRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 *
 * @author Aluno
 */
@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private FuncionarioMapper funcionarioMapper;

    public List<FuncionarioResponseDTO> listarTodos(String cargo, Boolean ativo) {
        List<Funcionario> funcionarios;

        if (cargo != null && ativo != null) {
            funcionarios = funcionarioRepository.findByCargoAndAtivoOrderByNome(cargo, ativo);
        } else if (cargo != null) {
            funcionarios = funcionarioRepository.findByCargoOrderByNome(cargo);
        } else if (ativo != null) {
            funcionarios = funcionarioRepository.findByAtivoOrderByNome(ativo);
        } else {
            funcionarios = funcionarioRepository.findAllByOrderByNome();
        }

        return funcionarios.stream()
                .map(funcionarioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public FuncionarioResponseDTO criar(FuncionarioRequestDTO dto) {
        Optional<Funcionario> funcionarioExistente = funcionarioRepository.findByEmail(dto.email());

        if (funcionarioExistente.isPresent()) {
            Funcionario funcionario = funcionarioExistente.get();
            if (!funcionario.isAtivo()) {
                funcionario.setNome(dto.nome());
                funcionario.setCargo(dto.cargo());
                funcionario.setSalario(dto.salario());
                funcionario.setDataAdmissao(dto.dataAdmissao());
                funcionario.setAtivo(true); 

                funcionarioRepository.save(funcionario);

                return funcionarioMapper.toResponseDTO(funcionario);
            } else {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um funcionário ativo com esse e-mail.");
            }
        }

        Funcionario funcionario = funcionarioMapper.toEntity(dto);
        funcionario.setAtivo(true);  
        Funcionario funcionarioSalvo = funcionarioRepository.save(funcionario);

        return funcionarioMapper.toResponseDTO(funcionarioSalvo);
    }

    public FuncionarioResponseDTO buscarPorId(Long id) {
        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado com ID: " + id));

        return funcionarioMapper.toResponseDTO(funcionario);
    }

    public FuncionarioResponseDTO atualizar(Long id, FuncionarioRequestDTO dto) {

        Funcionario funcionarioExistente = funcionarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado com ID: " + id));

        if (!funcionarioExistente.getAtivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Somente funcionários ativos podem ser editados.");
        }

        if (dto.salario().compareTo(funcionarioExistente.getSalario()) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O salário não pode ser reduzido.");
        }

        if (dto.dataAdmissao().isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A data de admissão não pode ser posterior à data atual (Regra 3.1).");
        }

        if (!funcionarioExistente.getEmail().equalsIgnoreCase(dto.email()) && funcionarioRepository.existsByEmail(dto.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "O e-mail informado já está cadastrado para outro funcionário.");
        }

        funcionarioExistente.setNome(dto.nome());
        funcionarioExistente.setEmail(dto.email());
        funcionarioExistente.setCargo(dto.cargo());
        funcionarioExistente.setSalario(dto.salario());
        funcionarioExistente.setDataAdmissao(dto.dataAdmissao());

        Funcionario funcionarioAtualizado = funcionarioRepository.save(funcionarioExistente);
        return funcionarioMapper.toResponseDTO(funcionarioAtualizado);
    }

    public void inativar(Long id) {
        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado com ID: " + id));

        if (funcionario.getAtivo()) {
            funcionario.setAtivo(false);
            funcionarioRepository.save(funcionario);
        }
    }

    public List<String> listarCargos() {
        return funcionarioRepository.findDistinctCargos();
    }

}
