import { Routes } from '@angular/router';
import { AgregarImagenes } from './admin/agregar-imagenes/agregar-imagenes';
import { Login } from './admin/login/login';
import { MostrarImagenes } from './admin/mostrar-imagenes/mostrar-imagenes';
import { PanelAvance } from './admin/panel-avance/panel-avance';
import { Usuarios } from './admin/usuarios/usuarios';
import { authGuard } from './guards/auth-guard';
import { Contacto } from './public/contacto/contacto';
import { Inicio } from './public/inicio/inicio';
import { LayoutPublico } from './public/layout-publico/layout-publico';
import { Nosotros } from './public/nosotros/nosotros';
import { Proyectos } from './public/proyectos/proyectos';
import { Servicios } from './public/servicios/servicios';
import { Clientes } from './admin/clientes/clientes';

export const routes: Routes = [
  {
    path: '',
    component: LayoutPublico,
    children: [
      { path: '', component: Inicio },
      { path: 'nosotros', component: Nosotros },
      { path: 'proyectos', component: Proyectos },
      { path: 'servicios', component: Servicios },
      { path: 'contacto', component: Contacto },
    ],
  },
  { path: 'login', component: Login },
  {
    path: 'panel',
    component: PanelAvance,
    canActivate: [authGuard],
        children: [
      { path: '', redirectTo: 'clientes', pathMatch: 'full' },
      { path: 'clientes', component: Clientes },
      { path: 'clientes/:clienteId/avances', component: MostrarImagenes },
      { path: 'agregar-avance', component: AgregarImagenes },
      { path: 'agregar-imagenes', component: AgregarImagenes },
      { path: 'editar-avance/:id', component: AgregarImagenes },
      { path: 'usuarios', component: Usuarios },
    ],

  },
  { path: '**', redirectTo: '' },
];
