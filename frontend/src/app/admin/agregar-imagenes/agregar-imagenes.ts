import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EstadoAvance } from '../../models/avance.model';
import { AvancesService } from '../../services/avances';

@Component({
  selector: 'app-agregar-imagenes',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './agregar-imagenes.html',
  styleUrl: './agregar-imagenes.scss',
})
export class AgregarImagenes implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly avancesService = inject(AvancesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly cargando = signal(false);
  protected readonly vistaPrevia = signal('');
  protected readonly avanceId = signal<string | null>(null);
  private archivoSeleccionado: File | null = null;

  protected readonly formulario = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required]],
    imagenUrl: [''],
    estado: ['EN_PROGRESO' as EstadoAvance, [Validators.required]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.avanceId.set(id);
      this.avancesService.obtenerPorId(id).subscribe((avance) => {
        this.formulario.patchValue(avance);
        this.vistaPrevia.set(avance.imagenUrl);
      });
    }
  }

  seleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.archivoSeleccionado = input.files[0];
    this.vistaPrevia.set(URL.createObjectURL(this.archivoSeleccionado));
  }

  guardarAvance(): void {
    if (this.formulario.invalid) return;
    this.cargando.set(true);

    if (this.archivoSeleccionado) {
      this.avancesService.subirImagen(this.archivoSeleccionado).subscribe({
        next: (res) => this.enviarDatos(res.url),
        error: () => this.cargando.set(false),
      });
    } else {
      this.enviarDatos(this.formulario.getRawValue().imagenUrl);
    }
  }

  private enviarDatos(imagenUrl: string): void {
    const payload = { ...this.formulario.getRawValue(), imagenUrl };
    const id = this.avanceId();

    const peticion = id
      ? this.avancesService.actualizar(id, payload)
      : this.avancesService.crear(payload);

    peticion.subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/panel/mostrar-imagenes']);
      },
      error: () => this.cargando.set(false),
    });
  }
}
