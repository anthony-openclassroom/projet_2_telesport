import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OlympicService } from '../../services/olympic.service';
import { KPI } from '../../models/kpi';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public titlePage: string = '';
  public kpis: KPI[] = [];
  private destroyRef = inject(DestroyRef);

  // Injection du service OlympicService pour accéder aux données du header
  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    // Souscription aux observables du service pour mettre à jour le titre
    this.olympicService.title$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((title) => {
        // ⬆️ Le suffixe $ (Finnish notation) indique que c'est un Observable, alors que 'title' est la valeur extraite de ce flux.
        this.titlePage = title;
      });
    // Et les KPIs du header
    this.olympicService.kpis$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((kpis) => {
        this.kpis = kpis;
      });
  }
}
