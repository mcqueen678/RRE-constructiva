import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ESTADOS_OBRA, EstadoAvance } from '../../models/avance.model';
import { Cliente } from '../../models/cliente.model';
import { AvancesService } from '../../services/avances';
import { ClientesService } from '../../services/clientes';

@Component({
  selector: 'app-agregar-imagenes',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './agregar-imagenes.html',
  styleUrl: './agregar-imagenes.scss',
})
export class AgregarImagenes implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly avancesService = inject(AvancesService);
  private readonly clientesService = inject(ClientesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly cargando = signal(false);
  protected readonly vistasPrevias = signal<string[]>([]);
  protected readonly avanceId = signal<string | null>(null);
  protected readonly clientes = signal<Cliente[]>([]);
  protected readonly estadosObra = ESTADOS_OBRA;
  protected readonly mensajeLimite = signal('');
  private archivosSeleccionados: File[] = [];

  protected readonly formulario = this.fb.nonNullable.group({
    clienteId: ['', [Validators.required]],
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required]],
    imagenUrl: [''],
    estado: ['SO' as EstadoAvance, [Validators.required]],
  });

  protected readonly cupoDisponible = computed(() => {
    const id = this.formulario.controls.clienteId.value;
    const cliente = this.clientes().find((c) => c.id === id);
    const actuales = cliente?.avances?.length ?? 0;
    return Math.max(0, 6 - actuales);
  });

  ngOnInit(): void {
    this.clientesService.listar().subscribe((lista) => this.clientes.set(lista));

    const clienteIdQuery = this.route.snapshot.queryParamMap.get('clienteId');
    if (clienteIdQuery) {
      this.formulario.patchValue({ clienteId: clienteIdQuery });
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.avanceId.set(id);
      this.avancesService.obtenerPorId(id).subscribe((avance) => {
        this.formulario.patchValue({
          clienteId: avance.clienteId ?? '',
          titulo: avance.titulo,
          descripcion: avance.descripcion,
          imagenUrl: avance.imagenUrl,
          estado: avance.estado,
        });
        if (avance.imagenUrl) {
          this.vistasPrevias.set([avance.imagenUrl]);
        }
      });
    }
  }

  seleccionarArchivos(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const maxPermitido = this.avanceId() ? 1 : this.cupoDisponible() || 6;
    const seleccionados = Array.from(input.files).slice(0, maxPermitido);

    if (input.files.length > maxPermitido) {
      this.mensajeLimite.set(`Solo se seleccionaron ${maxPermitido} foto(s) para no superar el límite de 6 por cliente.`);
    } else {
      this.mensajeLimite.set('');
    }

    this.archivosSeleccionados = seleccionados;
    this.vistasPrevias.set(seleccionados.map((file) => URL.createObjectURL(file)));
  }

  guardarAvance(): void {
    if (this.formulario.invalid) return;
    this.cargando.set(true);

    if (this.archivosSeleccionados.length > 0) {
      this.avancesService.subirMultiplesImagenes(this.archivosSeleccionados).subscribe({
        next: (res) => this.registrarAvances(res.urls),
        error: () => this.cargando.set(false),
      });
    } else {
      const urlActual = this.formulario.getRawValue().imagenUrl;
      this.registrarAvances(urlActual ? [urlActual] : []);
    }
  }

  private registrarAvances(urls: string[]): void {
    const base = this.formulario.getRawValue();
    const id = this.avanceId();

    if (id) {
      this.avancesService
         .actualizar(id, { ...base, imagenUrl: urls[0] ?? base.imagenUrl })
        .subscribe({
          next: () => {
            this.cargando.set(false);
            this.router.navigate(['/panel/clientes', base.clienteId, 'avances']);
          },
          error: () => this.cargando.set(false),
        });
      return;
    }

    const peticiones = urls.map((url, index) =>
      this.avancesService.crear({
        clienteId: base.clienteId,
        titulo: urls.length > 1 ? `${base.titulo} (${index + 1}/${urls.length})` : base.titulo,
        descripcion: base.descripcion,
        estado: base.estado,
        imagenUrl: url,
      }),
    );

    forkJoin(peticiones).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/panel/clientes', base.clienteId, 'avances']);
      },
      error: () => this.cargando.set(false),
    });
  }
}
