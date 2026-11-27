import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cliente } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/clientes`;

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  obtenerPorId(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  crear(cliente: Omit<Cliente, 'id' | 'fechaRegistro' | 'avances'>): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  actualizar(id: string, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
