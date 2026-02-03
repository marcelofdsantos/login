import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EmpilhadeiraResponse,
  EmpilhadeiraRequest,
  BloquearEmpilhadeiraRequest
} from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class EmpilhadeiraService {
  private readonly API_URL = 'http://localhost:8080/api/empilhadeiras';

  constructor(private http: HttpClient) {}

  /**
   * Lista todas as empilhadeiras
   */
  listarTodas(): Observable<EmpilhadeiraResponse[]> {
    return this.http.get<EmpilhadeiraResponse[]>(this.API_URL);
  }

  /**
   * Lista empilhadeiras ativas
   */
  listarAtivas(): Observable<EmpilhadeiraResponse[]> {
    return this.http.get<EmpilhadeiraResponse[]>(`${this.API_URL}/ativas`);
  }

  /**
   * Lista empilhadeiras disponíveis (não bloqueadas)
   */
  listarDisponiveis(): Observable<EmpilhadeiraResponse[]> {
    return this.http.get<EmpilhadeiraResponse[]>(`${this.API_URL}/disponiveis`);
  }

  /**
   * Lista empilhadeiras bloqueadas
   */
  listarBloqueadas(): Observable<EmpilhadeiraResponse[]> {
    return this.http.get<EmpilhadeiraResponse[]>(`${this.API_URL}/bloqueadas`);
  }

  /**
   * Busca empilhadeira por ID
   */
  buscarPorId(id: number): Observable<EmpilhadeiraResponse> {
    return this.http.get<EmpilhadeiraResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * Cria uma nova empilhadeira
   */
  criar(request: EmpilhadeiraRequest): Observable<EmpilhadeiraResponse> {
    return this.http.post<EmpilhadeiraResponse>(this.API_URL, request);
  }

  /**
   * Bloqueia uma empilhadeira
   */
  bloquear(id: number, request: BloquearEmpilhadeiraRequest): Observable<EmpilhadeiraResponse> {
    return this.http.patch<EmpilhadeiraResponse>(`${this.API_URL}/${id}/bloquear`, request);
  }

  /**
   * Desbloqueia uma empilhadeira
   */
  desbloquear(id: number): Observable<EmpilhadeiraResponse> {
    return this.http.patch<EmpilhadeiraResponse>(`${this.API_URL}/${id}/desbloquear`, {});
  }

  /**
   * Inativa uma empilhadeira
   */
  inativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
