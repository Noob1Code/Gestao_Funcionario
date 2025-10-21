import { HttpClient, HttpParams } from "@angular/common/http";
import {Injectable, Inject, inject} from "@angular/core";
import { Observable } from "rxjs";
import { FuncionarioResponse, FuncionarioRequest } from "../models/models.component";

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
private apiUrl = 'http://localhost:8080/api/v1/funcionarios';
  private http = inject(HttpClient);

  listarFuncionarios(cargo?: string | null, ativo?: boolean | null): Observable<FuncionarioResponse[]> {
    let params = new HttpParams();

    if (cargo) {
      params = params.append('cargo', cargo);
    }
    if (ativo !== undefined && ativo !== null) {
      params = params.append('ativo', ativo.toString());
    }

    return this.http.get<FuncionarioResponse[]>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<FuncionarioResponse> {
    return this.http.get<FuncionarioResponse>(`${this.apiUrl}/${id}`);
  }

  cadastrar(funcionario: FuncionarioRequest): Observable<FuncionarioResponse> {
    return this.http.post<FuncionarioResponse>(this.apiUrl, funcionario);
  }

  atualizar(id: number, funcionario: FuncionarioRequest): Observable<FuncionarioResponse> {
    return this.http.put<FuncionarioResponse>(`${this.apiUrl}/${id}`, funcionario);
  }

  inativar(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/inativar`, null);
  }

  listarCargos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/cargos`);
  }

}
