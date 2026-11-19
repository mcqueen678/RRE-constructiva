import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios';

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  const usuariosService = inject(UsuariosService);
  const router = inject(Router);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (usuariosService.obtenerUsuarioActivo()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
