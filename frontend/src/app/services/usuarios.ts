import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CrearUsuarioDto, LoginDto, Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiUrl = `${environment.apiUrl}/usuarios`;

  login(credenciales: LoginDto): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, credenciales).pipe(
      tap((usuario) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('usuario_activo', JSON.stringify(usuario));
        }
      }),
    );
  }

  cerrarSesion(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuario_activo');
    }
  }

  obtenerUsuarioActivo(): Usuario | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const data = localStorage.getItem('usuario_activo');
    return data ? (JSON.parse(data) as Usuario) : null;
  }

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  crear(datos: CrearUsuarioDto): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, datos);
  }

  actualizar(id: string, datos: Partial<CrearUsuarioDto>): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
