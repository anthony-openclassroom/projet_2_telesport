import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import Chart, { ArcElement } from 'chart.js/auto';
import { Olympic } from 'src/app/models/olympic';
import { OlympicService } from 'src/app/services/olympic.service';
import { DataService } from 'src/app/services/data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public pieChart!: Chart<'pie', number[], string>;
  public error!: string;
  private destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private olympicService: OlympicService,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.dataService
      .getOlympicData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        // Ici, j'utilise la nouvelle syntaxe de souscription avec un objet pour gérer les cas de succès et d'erreur de manière plus claire.
        next: (data) => {
          if (data && data.length > 0) {
            const allYears = data.flatMap((olympic) =>
              olympic.participations.map((p) => p.year),
            );
            const totalJOs = new Set(allYears).size;

            const countries: string[] = data.map((i: Olympic) => i.country);
            const totalCountries = countries.length;

            this.olympicService.updateHeaderData('Medals per Country', [
              { label: 'Number of JOs', value: totalJOs },
              { label: 'Number of countries', value: totalCountries },
            ]);

            const sumOfAllMedalsYears = data.map((olympic) =>
              this.dataService.calculateTotalMedals(olympic.participations),
            );

            // Création d'un tableau d'IDs synchronisé avec les données
            const countryIds = data.map((olympic) => olympic.id);

            this.buildPieChart(countries, sumOfAllMedalsYears, countryIds);
          }
        },
        error: (error) => {
          console.log(`erreur : ${error}`);
          this.error = error.message;
        },
      });
  }

  buildPieChart(
    countries: string[],
    sumOfAllMedalsYears: number[],
    countryIds: number[],
  ) {
    const pieChart = new Chart('DashboardPieChart', {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [
          {
            label: 'Medals',
            data: sumOfAllMedalsYears,
            backgroundColor: [
              '#793d52',
              '#89a1db',
              '#9780a1',
              '#bfe0f1',
              '#b8cbe7',
              '#956065',
            ],
            borderColor: 'white',
            borderWidth: 2,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        maintainAspectRatio: false, // Permet au graphique de s'adapter à la hauteur du conteneur
        responsive: true,
        font: {
          family: 'Roboto',
        },
        layout: {
          padding: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#04838f',
            titleAlign: 'center',
            bodyAlign: 'center',
            displayColors: false,
            callbacks: {
              label: function (context) {
                const value = context.raw;
                return ` 🏅 ${value}`;
              },
            },
          },
        },
        onClick: (e) => {
          const nativeEvent = e.native;
          if (nativeEvent) {
            const points = pieChart.getElementsAtEventForMode(
              nativeEvent,
              'point',
              { intersect: true },
              true,
            );
            if (points.length) {
              const firstPoint = points[0];
              const countryId = countryIds[firstPoint.index];
              this.router.navigate(['country', countryId]);
            }
          }
        },
      },
      plugins: [
        {
          id: 'customLabels',
          afterDraw: (chart) => {
            const ctx = chart.ctx;
            chart.data.datasets.forEach((dataset, i) => {
              const meta = chart.getDatasetMeta(i);
              if (!meta.hidden) {
                meta.data.forEach((element, index) => {
                  // On caste l'élément en 'ArcElement' pour accéder aux propriétés spécifiques
                  const arc = element as ArcElement;
                  const center = { x: arc.x, y: arc.y };

                  // Les angles de début et de fin sont nécessaires pour calculer l'angle médian
                  const startAngle = arc.startAngle;
                  const endAngle = arc.endAngle;

                  // Calcul de l'angle médian du segment pour déterminer sa direction
                  const angle = (startAngle + endAngle) / 2;

                  // Récupération du rayon extérieur pour savoir où commence la ligne
                  const outerRadius = arc.outerRadius;
                  const chartWidth = chart.width;

                  // Calcul des coordonnées du point sur le bord extérieur du segment
                  const pX = center.x + Math.cos(angle) * outerRadius;
                  const pY = center.y + Math.sin(angle) * outerRadius;

                  // On utilise le cosinus de l'angle pour déterminer si on est à gauche ou à droite
                  // cos(angle) > 0 => droite, cos(angle) < 0 => gauche
                  const isRightSide = Math.cos(angle) >= 0;

                  // On fixe une distance constante par rapport au centre pour aligner les textes verticalement
                  const alignOffset = outerRadius + 60; // Rayon + marge
                  const xLineEnd = isRightSide
                    ? center.x + alignOffset
                    : center.x - alignOffset;
                  const yLineEnd = pY;

                  // Dessiner la ligne
                  ctx.beginPath();
                  ctx.moveTo(pX, pY);
                  ctx.lineTo(xLineEnd, yLineEnd);
                  const bgColor = dataset.backgroundColor as string[];
                  ctx.strokeStyle = bgColor[index] || '#9caebc';
                  ctx.lineWidth = 1;
                  ctx.stroke();

                  // Dessiner le texte
                  ctx.font = '14px Roboto, Arial';
                  ctx.fillStyle = '#404040';
                  ctx.textAlign = isRightSide ? 'left' : 'right';
                  ctx.textBaseline = 'middle';

                  const label = chart.data.labels
                    ? (chart.data.labels[index] as string)
                    : '';

                  // Petit espace entre la ligne et le texte
                  const textOffset = isRightSide ? 5 : -5;

                  ctx.fillText(label, xLineEnd + textOffset, yLineEnd);
                });
              }
            });
          },
        },
      ],
    });
    this.pieChart = pieChart;
  }
}
