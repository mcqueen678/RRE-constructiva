import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../services/usuarios';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly usuariosService = inject(UsuariosService);
  private readonly router = inject(Router);

  protected readonly cargando = signal(false);
  protected readonly errorMensaje = signal('');

  protected readonly formulario = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  iniciarSesion(): void {
    if (this.formulario.invalid) return;

    this.cargando.set(true);
    this.errorMensaje.set('');

    this.usuariosService.login(this.formulario.getRawValue()).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/panel']);
      },
      error: () => {
        this.cargando.set(false);
        this.errorMensaje.set('Correo o contraseña incorrectos.');
      },
    });
  }
}
