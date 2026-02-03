import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChecklistRequest, ChecklistResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private readonly API_URL = 'http://localhost:8080/api/checklists';

  constructor(private http: HttpClient) {}

  /**
   * Cria um novo checklist
   */
  criar(request: ChecklistRequest): Observable<ChecklistResponse> {
    return this.http.post<ChecklistResponse>(this.API_URL, request);
  }

  /**
   * Lista todos os checklists
   */
  listarTodos(): Observable<ChecklistResponse[]> {
    return this.http.get<ChecklistResponse[]>(this.API_URL);
  }

  /**
   * Busca checklist por ID
   */
  buscarPorId(id: number): Observable<ChecklistResponse> {
    return this.http.get<ChecklistResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * Lista checklists por empilhadeira
   */
  listarPorEmpilhadeira(empilhadeiraId: number): Observable<ChecklistResponse[]> {
    return this.http.get<ChecklistResponse[]>(`${this.API_URL}/empilhadeira/${empilhadeiraId}`);
  }

  /**
   * Lista checklists por operador
   */
  listarPorOperador(operadorId: number): Observable<ChecklistResponse[]> {
    return this.http.get<ChecklistResponse[]>(`${this.API_URL}/operador/${operadorId}`);
  }

  /**
   * Lista checklists por data
   */
  listarPorData(data: string): Observable<ChecklistResponse[]> {
    return this.http.get<ChecklistResponse[]>(`${this.API_URL}/data/${data}`);
  }

  /**
   * Lista checklists por período
   */
  listarPorPeriodo(dataInicio: string, dataFim: string): Observable<ChecklistResponse[]> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);
    
    return this.http.get<ChecklistResponse[]>(`${this.API_URL}/periodo`, { params });
  }
}
