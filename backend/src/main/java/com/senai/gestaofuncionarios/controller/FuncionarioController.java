/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.senai.gestaofuncionarios.controller;

import com.senai.gestaofuncionarios.dto.FuncionarioRequestDTO;
import com.senai.gestaofuncionarios.dto.FuncionarioResponseDTO;
import com.senai.gestaofuncionarios.service.FuncionarioService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Aluno
 */
@RestController
@RequestMapping("/api/v1/funcionarios")
@CrossOrigin(origins = "http://localhost:4200")
public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;

    @GetMapping
    public List<FuncionarioResponseDTO> listarTodos(
            @RequestParam(required = false) String cargo,
            @RequestParam(required = false) Boolean ativo
    ) {
        return funcionarioService.listarTodos(cargo, ativo);
    }

    @GetMapping("/{id}")
    public FuncionarioResponseDTO buscarPorId(@PathVariable Long id) {
        return funcionarioService.buscarPorId(id);
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public FuncionarioResponseDTO criar(@Valid @RequestBody FuncionarioRequestDTO dto) {
        return funcionarioService.criar(dto);
    }

    @PutMapping("{id}")
    public FuncionarioResponseDTO atualizar(@PathVariable Long id, @Valid @RequestBody FuncionarioRequestDTO dto) {
        return funcionarioService.atualizar(id, dto);
    }

    @PatchMapping("/{id}/inativar")
    public void inativar(@PathVariable Long id) {
        funcionarioService.inativar(id);
    }

    @GetMapping("/cargos")
    public List<String> listarCargos() {
        return funcionarioService.listarCargos();
    }

}
