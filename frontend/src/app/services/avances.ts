import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Avance, CrearAvanceDto } from '../models/avance.model';

@Injectable({ providedIn: 'root' })
export class AvancesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/avances`;

  listar(clienteId?: string): Observable<Avance[]> {
    const url = clienteId ? `${this.apiUrl}?clienteId=${clienteId}` : this.apiUrl;
    return this.http.get<Avance[]>(url);
  }


  obtenerPorId(id: string): Observable<Avance> {
    return this.http.get<Avance>(`${this.apiUrl}/${id}`);
  }

  subirImagen(archivo: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('imagen', archivo);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
  }

    subirMultiplesImagenes(archivos: File[]): Observable<{ urls: string[] }> {
    const formData = new FormData();
    archivos.forEach((archivo) => formData.append('imagenes', archivo));
    return this.http.post<{ urls: string[] }>(`${this.apiUrl}/upload-multiple`, formData);
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
