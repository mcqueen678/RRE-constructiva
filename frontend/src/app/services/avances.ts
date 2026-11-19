import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Avance, CrearAvanceDto } from '../models/avance.model';

@Injectable({ providedIn: 'root' })
export class AvancesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/avances`;

  listar(): Observable<Avance[]> {
    return this.http.get<Avance[]>(this.apiUrl);
  }

  obtenerPorId(id: string): Observable<Avance> {
    return this.http.get<Avance>(`${this.apiUrl}/${id}`);
  }

  subirImagen(archivo: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('imagen', archivo);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
  }

  crear(datos: CrearAvanceDto): Observable<Avance> {
    return this.http.post<Avance>(this.apiUrl, datos);
  }

  actualizar(id: string, datos: Partial<CrearAvanceDto>): Observable<Avance> {
    return this.http.patch<Avance>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
