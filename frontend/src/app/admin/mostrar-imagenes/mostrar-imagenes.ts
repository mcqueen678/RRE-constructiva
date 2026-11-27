import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Avance, ESTADOS_OBRA, EstadoAvance, obtenerNombreEstado } from '../../models/avance.model';
import { Cliente } from '../../models/cliente.model';
import { AvancesService } from '../../services/avances';
import { ClientesService } from '../../services/clientes';
import { PdfReporteService } from '../../services/pdf-reporte.service';
import { UsuariosService } from '../../services/usuarios';

@Component({
  selector: 'app-mostrar-imagenes',
  imports: [RouterLink, DatePipe],
  templateUrl: './mostrar-imagenes.html',
  styleUrl: './mostrar-imagenes.scss',
})
export class MostrarImagenes implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly avancesService = inject(AvancesService);
  private readonly clientesService = inject(ClientesService);
  private readonly pdfService = inject(PdfReporteService);
  private readonly usuariosService = inject(UsuariosService);

  protected readonly clienteId = signal<string | null>(null);
  protected readonly clienteActual = signal<Cliente | null>(null);
  protected readonly avances = signal<Avance[]>([]);
  protected readonly filtroEstado = signal<'TODOS' | EstadoAvance>('TODOS');
  protected readonly cargando = signal(true);
  protected readonly generandoPdf = signal(false);
  protected readonly estadosObra = ESTADOS_OBRA;
  protected readonly nombreEstado = obtenerNombreEstado;

  protected readonly avancesFiltrados = computed(() => {
    const filtro = this.filtroEstado();
    if (filtro === 'TODOS') return this.avances();
    return this.avances().filter((a) => a.estado === filtro);
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('clienteId');
      this.clienteId.set(id);
      if (id) {
        this.clientesService.obtenerPorId(id).subscribe((c) => this.clienteActual.set(c));
      } else {
        this.clienteActual.set(null);
      }
      this.cargarAvances(id ?? undefined);
    });
  }

  cargarAvances(clienteId?: string): void {
    this.cargando.set(true);
    this.avancesService.listar(clienteId).subscribe({
      next: (data) => {
        this.avances.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  cambiarFiltro(estado: 'TODOS' | EstadoAvance): void {
    this.filtroEstado.set(estado);
  }

  async exportarPdf(): Promise<void> {
    const lista = this.avancesFiltrados();
    if (!lista.length) return;

    this.generandoPdf.set(true);
    const cliente = this.clienteActual();
    const responsable = cliente
      ? `${this.usuariosService.obtenerUsuarioActivo()?.nombre ?? 'Supervisor'} | Cliente: ${cliente.nombre} (${cliente.proyecto})`
      : (this.usuariosService.obtenerUsuarioActivo()?.nombre ?? 'Ingeniero Supervisor');

    await this.pdfService.generarInformeAvances(lista, responsable);
    this.generandoPdf.set(false);
  }

  async exportarPdfIndividual(avance: Avance): Promise<void> {
    this.generandoPdf.set(true);
    const cliente = this.clienteActual();
    const responsable = cliente
      ? `${this.usuariosService.obtenerUsuarioActivo()?.nombre ?? 'Supervisor'} | Cliente: ${cliente.nombre} (${cliente.proyecto})`
      : (this.usuariosService.obtenerUsuarioActivo()?.nombre ?? 'Ingeniero Supervisor');

    await this.pdfService.generarInformeAvances([avance], responsable);
    this.generandoPdf.set(false);
  }

  eliminarAvance(id: string): void {
    this.avancesService.eliminar(id).subscribe(() => {
      this.avances.update((actual) => actual.filter((a) => a.id !== id));
    });
  }
}
