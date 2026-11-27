import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { ClientesService } from '../../services/clientes';

@Component({
  selector: 'app-clientes',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss',
})
export class Clientes implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly clientesService = inject(ClientesService);

  protected readonly clientes = signal<Cliente[]>([]);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly editandoId = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    codigoProyecto: [''],
    nombre: ['', Validators.required],
    ruc: [''],
    direccion: [''],
    ubicacion: [''],
    modalidad: ['CSP'],
    proyecto: ['', Validators.required],
    telefono: [''],
  });

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando.set(true);
    this.clientesService.listar().subscribe({
      next: (data) => {
        this.clientes.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  guardar(): void {
    if (this.form.invalid) return;
    this.guardando.set(true);
    const datos = this.form.getRawValue();
    const id = this.editandoId();

    const peticion = id
      ? this.clientesService.actualizar(id, datos)
      : this.clientesService.crear(datos);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cancelarEdicion();
        this.cargarClientes();
      },
      error: () => this.guardando.set(false),
    });
  }

  editar(cliente: Cliente): void {
    this.editandoId.set(cliente.id);
    this.form.patchValue({
      codigoProyecto: cliente.codigoProyecto ?? '',
      nombre: cliente.nombre,
      ruc: cliente.ruc ?? '',
      direccion: cliente.direccion ?? '',
      ubicacion: cliente.ubicacion ?? '',
      modalidad: cliente.modalidad ?? 'CSP',
      proyecto: cliente.proyecto,
      telefono: cliente.telefono ?? '',
    });
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
    this.form.reset({ modalidad: 'CSP' });
  }

  calcularPorcentaje(cliente: Cliente): number {
    const totalFotos = cliente.avances?.length ?? 0;
    return Math.min(100, Math.round((totalFotos / 6) * 100));
  }

  eliminar(id: string): void {
    this.clientesService.eliminar(id).subscribe(() => {
      this.clientes.update((lista) => lista.filter((c) => c.id !== id));
    });
  }
}
