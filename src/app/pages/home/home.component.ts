import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Olympic } from 'src/app/models/olympic';
import { OlympicService } from 'src/app/services/olympic.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public pieChart!: Chart<'pie', number[], string>;
  public error!: string;

  constructor(
    private router: Router,
    private olympicService: OlympicService,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.dataService
      .getOlympicData()
      .pipe()
      .subscribe({
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

            this.buildPieChart(countries, sumOfAllMedalsYears);
          }
        },
        error: (error) => {
          console.log(`erreur : ${error}`);
          this.error = error.message;
        },
      });
  }

  buildPieChart(countries: string[], sumOfAllMedalsYears: number[]) {
    const pieChart = new Chart('DashboardPieChart', {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [
          {
            label: 'Medals',
            data: sumOfAllMedalsYears,
            backgroundColor: [
              '#0b868f',
              '#adc3de',
              '#7a3c53',
              '#8f6263',
              'orange',
              '#94819d',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (e) => {
          if (e.native) {
            const points = pieChart.getElementsAtEventForMode(
              e.native,
              'point',
              { intersect: true },
              true,
            );
            if (points.length) {
              const firstPoint = points[0];
              const countryName = pieChart.data.labels
                ? pieChart.data.labels[firstPoint.index]
                : '';
              this.router.navigate(['country', countryName]);
            }
          }
        },
      },
    });
    this.pieChart = pieChart;
  }
}
