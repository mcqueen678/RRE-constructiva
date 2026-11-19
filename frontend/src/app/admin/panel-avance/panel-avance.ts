import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UsuariosService } from '../../services/usuarios';

@Component({
  selector: 'app-panel-avance',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './panel-avance.html',
  styleUrl: './panel-avance.scss',
})
export class PanelAvance {
  private readonly usuariosService = inject(UsuariosService);
  private readonly router = inject(Router);

  protected readonly usuarioActual = this.usuariosService.obtenerUsuarioActivo();

  salir(): void {
    this.usuariosService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
