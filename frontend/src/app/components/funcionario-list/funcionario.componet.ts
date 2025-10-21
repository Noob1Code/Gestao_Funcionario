import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FuncionarioResponse } from "../../models/models.component";
import { FuncionarioService } from '../../services/services.funcionario';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

const STATUS_OPTIONS = [
  { label: 'Todos', value: null, icon: 'pi pi-filter-slash' },
  { label: 'Ativo', value: true, icon: 'pi pi-check' },
  { label: 'Inativo', value: false, icon: 'pi pi-times' }
];

@Component({
  selector: 'app-funcionario-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule, 
    TableModule,
    ButtonModule,
    TagModule,
    DropdownModule,
    SelectButtonModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  templateUrl: './funcionario.component.html',
  providers: [MessageService, ConfirmationService] 
})
export class FuncionarioListComponent {
  private service = inject(FuncionarioService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  funcionarios = signal<FuncionarioResponse[]>([]);
  isLoading = signal(false); 

  cargos: { label: string; value: string | null }[] = [{ label: 'Todos', value: null }];
  statusOptions = STATUS_OPTIONS;
  filtroCargo: string | null = null;
  filtroStatus: boolean | null = null;

  constructor() {
    this.carregarCargos();
    this.carregarFuncionarios();
  }

  carregarFuncionarios(): void {
    this.isLoading.set(true);
    this.service.listarFuncionarios(this.filtroCargo, this.filtroStatus).subscribe({
      next: (data) => {
        const sortedData = data.sort((a, b) => a.nome.localeCompare(b.nome));
        this.funcionarios.set(sortedData);
        this.isLoading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar funcionários.' });
        this.isLoading.set(false);
      }
    });
  }

  carregarCargos(): void {
    this.service.listarCargos().subscribe({
      next: (data) => {
        const lista = data.map(c => ({ label: c, value: c }));
        this.cargos = [{ label: 'Todos', value: null }, ...lista];
      },
      error: () => {
        this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Falha ao carregar cargos. Usando lista local.' });
      }
    });
  }

  aplicarFiltros(): void {
    this.carregarFuncionarios();
  }

  navegarParaEdicao(id: number): void {
    this.router.navigate(['/funcionarios/editar', id]);
  }

  inativarFuncionario(event: Event, funcionario: FuncionarioResponse): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Tem certeza que deseja inativar o funcionário ${funcionario.nome}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.inativar(funcionario.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário inativado.' });
            this.carregarFuncionarios(); 
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message || 'Falha ao inativar.' });
          }
        });
      }
    });
  }
}
