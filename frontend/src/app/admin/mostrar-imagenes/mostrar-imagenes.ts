import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Avance, EstadoAvance } from '../../models/avance.model';
import { AvancesService } from '../../services/avances';
import { PdfReporteService } from '../../services/pdf-reporte.service';
import { UsuariosService } from '../../services/usuarios';

@Component({
  selector: 'app-mostrar-imagenes',
  imports: [RouterLink, DatePipe],
  templateUrl: './mostrar-imagenes.html',
  styleUrl: './mostrar-imagenes.scss',
})
export class MostrarImagenes implements OnInit {
  private readonly avancesService = inject(AvancesService);
  private readonly pdfService = inject(PdfReporteService);
  private readonly usuariosService = inject(UsuariosService);

  protected readonly avances = signal<Avance[]>([]);
  protected readonly filtroEstado = signal<'TODOS' | EstadoAvance>('TODOS');
  protected readonly cargando = signal(true);
  protected readonly generandoPdf = signal(false);

  protected readonly avancesFiltrados = computed(() => {
    const filtro = this.filtroEstado();
    if (filtro === 'TODOS') return this.avances();
    return this.avances().filter((a) => a.estado === filtro);
  });

  ngOnInit(): void {
    this.cargarAvances();
  }

  cargarAvances(): void {
    this.cargando.set(true);
    this.avancesService.listar().subscribe({
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

    // Descarga TODOS los avances filtrados (Botón del encabezado)
  async exportarPdf(): Promise<void> {
    const lista = this.avancesFiltrados();
    if (!lista.length) return;

    this.generandoPdf.set(true);
    const responsable = this.usuariosService.obtenerUsuarioActivo()?.nombre ?? 'Ingeniero Supervisor';
    await this.pdfService.generarInformeAvances(lista, responsable);
    this.generandoPdf.set(false);
  }

  // Descarga SOLO el avance de esa tarjeta (Botón individual)
  async exportarPdfIndividual(avance: Avance): Promise<void> {
    this.generandoPdf.set(true);
    const responsable = this.usuariosService.obtenerUsuarioActivo()?.nombre ?? 'Ingeniero Supervisor';
    await this.pdfService.generarInformeAvances([avance], responsable);
    this.generandoPdf.set(false);
  }


  eliminarAvance(id: string): void {
    this.avancesService.eliminar(id).subscribe(() => {
      this.avances.update((actual) => actual.filter((a) => a.id !== id));
    });
  }
}
