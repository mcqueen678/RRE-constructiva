import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Avance } from '../../models/avance.model';
import { AvancesService } from '../../services/avances';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio implements OnInit {
  private readonly avancesService = inject(AvancesService);

  protected readonly ultimosAvances = signal<Avance[]>([]);

  ngOnInit(): void {
    this.avancesService.listar().subscribe((data) => {
      this.ultimosAvances.set(data.slice(0, 3));
    });
  }
}
