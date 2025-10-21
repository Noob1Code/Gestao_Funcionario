import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionarioRequest } from "../../models/models.component";
import { FuncionarioService } from '../../services/services.funcionario';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: 'funcionario-form.component.html',
  providers: [MessageService]
})
export class FuncionarioFormComponent implements OnInit {
  constructor(private router: Router) {}
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(FuncionarioService);
  private messageService = inject(MessageService);

  funcionarioForm!: FormGroup;
  isEditMode: boolean = false; 
  funcionarioId: number | null = null;
  pageTitle: string = 'Cadastrar Novo Funcionário';

  ngOnInit(): void {
    this.initializeForm();

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.funcionarioId = +idParam;
        this.pageTitle = 'Editar Funcionário';
        this.carregarFuncionarioParaEdicao(this.funcionarioId);
      }
    });
  }

  noWhitespaceValidator(control: AbstractControl): { [key: string]: any } | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace || control.value.length === 0; 
    return isValid ? null : { 'whitespace': true };
  }

  dateNotFutureValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const date = control.value;
      if (date && new Date(date) > new Date()) {
        return { 'dateFuture': true };
      }
      return null;
    };
  }

  initializeForm(): void {
    this.funcionarioForm = this.fb.group({
      nome: ['', [
        Validators.required,
        Validators.minLength(3), 
        this.noWhitespaceValidator 
      ]],
      email: ['', [
        Validators.required,
        Validators.email, 
        this.noWhitespaceValidator
      ]],
      cargo: ['', [
        Validators.required,
        this.noWhitespaceValidator
      ]],
      salario: [null, [
        Validators.required,
        Validators.min(0.01) 
      ]],
      dataAdmissao: [null, [
        Validators.required,
        this.dateNotFutureValidator() 
      ]]
    });
  }

  carregarFuncionarioParaEdicao(id: number): void {
    this.service.buscarPorId(id).subscribe({
      next: (data) => {
        const dataAdmissaoDate = data.dataAdmissao ? new Date(data.dataAdmissao + 'T00:00:00') : null;

        this.funcionarioForm.patchValue({
          nome: data.nome,
          email: data.email,
          cargo: data.cargo,
          salario: data.salario,
          dataAdmissao: dataAdmissaoDate
        });

        if (!data.ativo) {
          this.funcionarioForm.disable();
          this.messageService.add({ severity: 'info', summary: 'Aviso', detail: 'Este funcionário está inativo e não pode ser editado.' });
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Funcionário não encontrado.' });
        this.router.navigate(['/funcionarios']);
      }
    });
  }

  onSubmit(): void {
    if (this.funcionarioForm.invalid) {
      this.funcionarioForm.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Verifique os campos com erro.' });
      return;
    }

    const formValue = this.funcionarioForm.getRawValue();
    const dataAdmissaoFormatada = (formValue.dataAdmissao as Date).toISOString().split('T')[0];

    const request: FuncionarioRequest = {
      ...formValue,
      dataAdmissao: dataAdmissaoFormatada
    };

    if (this.isEditMode && this.funcionarioId) {
      this.service.atualizar(this.funcionarioId, request).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário atualizado.' });
          this.router.navigate(['/funcionarios']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro na Edição',
            detail: err.error?.message || 'Falha ao atualizar. Verifique as regras de negócio (Salário não reduzido, Email único).'
          });
        }
      });
    } else {
      this.service.cadastrar(request).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário cadastrado.' });
          this.router.navigate(['/funcionarios']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro no Cadastro',
            detail: err.error?.message || 'Falha ao cadastrar. Verifique se o e-mail já existe.'
          });
        }
      });
    }
  }

  get f() {
    return this.funcionarioForm.controls;
  }

  cancelar(): void {
    this.router.navigate(['/funcionarios']); 
  }
}
