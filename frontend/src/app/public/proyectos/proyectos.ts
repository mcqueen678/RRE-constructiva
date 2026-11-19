import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Avance } from '../../models/avance.model';
import { AvancesService } from '../../services/avances';

@Component({
  selector: 'app-proyectos',
  imports: [DatePipe],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.scss',
})
export class Proyectos implements OnInit {
  private readonly avancesService = inject(AvancesService);

  protected readonly proyectos = signal<Avance[]>([]);

  ngOnInit(): void {
    this.avancesService.listar().subscribe((data) => this.proyectos.set(data));
  }
}
