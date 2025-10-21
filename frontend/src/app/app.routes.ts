import { Routes } from '@angular/router';
import { FuncionarioFormComponent } from './components/funcionario-form/funcionario-form.component';
import { FuncionarioListComponent } from './components/funcionario-list/funcionario.componet';

export const routes: Routes = [
  { 
    path: 'funcionarios', 
    component: FuncionarioListComponent 
  },
  
  { 
    path: 'funcionarios/novo', 
    component: FuncionarioFormComponent 
  },

  { 
    path: 'funcionarios/editar/:id', 
    component: FuncionarioFormComponent 
  },
  
  { 
    path: '', 
    redirectTo: '/funcionarios', 
    pathMatch: 'full' 
  },
  
  { 
    path: '**', 
    redirectTo: '/funcionarios' 
  }
];
