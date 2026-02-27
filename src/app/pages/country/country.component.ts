import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { OlympicService } from 'src/app/services/olympic.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  public lineChart!: Chart;
  public error!: string;
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private olympicService = inject(OlympicService);
  private dataService = inject(DataService);

  ngOnInit() {
    const countryId = this.route.snapshot.paramMap.get('id');
    if (countryId) {
      this.dataService
        .getOlympicsByCountry(countryId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (country: any) => {
            if (country) {
              this.olympicService.updateHeaderData(country.country, [
                {
                  label: 'Number of entries',
                  value: country.participations.length,
                },
                { label: 'Total Number of medals', value: country.totalMedals },
                {
                  label: 'Total Number of athletes',
                  value: country.totalAthletes,
                },
              ]);

              const years = country.participations.map((p: any) => p.year);
              const medals = country.participations.map((p: any) =>
                p.medalsCount.toString(),
              );

              this.buildChart(years, medals);
            } else {
              this.router.navigateByUrl('not-found');
            }
          },
          error: (error) => {
            this.error = error.message;
          },
        });
    }
  }

  buildChart(years: number[], medals: string[]) {
    const lineChart = new Chart('countryChart', {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'medals',
            data: medals.map((m) => parseInt(m)),
            backgroundColor: '#0b868f',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
    this.lineChart = lineChart;
  }
}
