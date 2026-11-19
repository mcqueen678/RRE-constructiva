import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Avance, EstadoAvance } from '../../models/avance.model';
import { AvancesService } from '../../services/avances';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mostrar-imagenes',
  imports: [DatePipe, RouterLink],
  templateUrl: './mostrar-imagenes.html',
  styleUrl: './mostrar-imagenes.scss',
})
export class MostrarImagenes implements OnInit {
  private readonly avancesService = inject(AvancesService);

  protected readonly avances = signal<Avance[]>([]);
  protected readonly filtroEstado = signal<'TODOS' | EstadoAvance>('TODOS');

  protected readonly avancesFiltrados = computed(() => {
    const filtro = this.filtroEstado();
    const lista = this.avances();
    return filtro === 'TODOS' ? lista : lista.filter((a) => a.estado === filtro);
  });

  ngOnInit(): void {
    this.cargarAvances();
  }

  cargarAvances(): void {
    this.avancesService.listar().subscribe((data) => this.avances.set(data));
  }

  cambiarFiltro(estado: 'TODOS' | EstadoAvance): void {
    this.filtroEstado.set(estado);
  }

  eliminarAvance(id: string): void {
    this.avancesService.eliminar(id).subscribe(() => {
      this.avances.update((lista) => lista.filter((item) => item.id !== id));
    });
  }
}
