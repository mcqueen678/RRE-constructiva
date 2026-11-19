import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrearUsuarioDto, RolUsuario, Usuario } from '../../models/usuario.model';
import { UsuariosService } from '../../services/usuarios';

@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class Usuarios implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usuariosService = inject(UsuariosService);

  protected readonly listaUsuarios = signal<Usuario[]>([]);
  protected readonly guardando = signal(false);
  protected readonly usuarioEditandoId = signal<string | null>(null);

  protected readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rol: ['SUPERVISOR' as RolUsuario, [Validators.required]],
  });

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuariosService.listar().subscribe((data) => this.listaUsuarios.set(data));
  }

  seleccionarParaEditar(usuario: Usuario): void {
    this.usuarioEditandoId.set(usuario.id);
    this.formulario.patchValue({
      nombre: usuario.nombre,
      correo: usuario.correo,
      password: '',
      rol: usuario.rol,
    });
    this.formulario.controls.password.clearValidators();
    this.formulario.controls.password.setValidators([Validators.minLength(6)]);
    this.formulario.controls.password.updateValueAndValidity();
  }

  cancelarEdicion(): void {
    this.usuarioEditandoId.set(null);
    this.formulario.reset({ rol: 'SUPERVISOR' });
    this.formulario.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
    this.formulario.controls.password.updateValueAndValidity();
  }

  guardarUsuario(): void {
    if (this.formulario.invalid) return;
    this.guardando.set(true);

    const valores = this.formulario.getRawValue();
    const idEditar = this.usuarioEditandoId();

    if (idEditar) {
      const datosActualizar: Partial<CrearUsuarioDto> = {
        nombre: valores.nombre,
        correo: valores.correo,
        rol: valores.rol,
      };
      if (valores.password.trim()) {
        datosActualizar.password = valores.password;
      }

      this.usuariosService.actualizar(idEditar, datosActualizar).subscribe({
        next: (actualizado) => {
          this.listaUsuarios.update((lista) =>
            lista.map((u) => (u.id === idEditar ? actualizado : u)),
          );
          this.cancelarEdicion();
          this.guardando.set(false);
        },
        error: () => this.guardando.set(false),
      });
    } else {
      this.usuariosService.crear(valores).subscribe({
        next: (nuevo) => {
          this.listaUsuarios.update((actual) => [...actual, nuevo]);
          this.formulario.reset({ rol: 'SUPERVISOR' });
          this.guardando.set(false);
        },
        error: () => this.guardando.set(false),
      });
    }
  }

  eliminarUsuario(id: string): void {
    this.usuariosService.eliminar(id).subscribe(() => {
      this.listaUsuarios.update((actual) => actual.filter((u) => u.id !== id));
    });
  }
}
