import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Olympic } from '../models/olympic';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private olympicUrl = './assets/mock/olympic.json';

  constructor(private http: HttpClient) {}

  getOlympicData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl);
  }

  //   Méthode pour récupérer les données d'un pays spécifique et calculer les KPIs associés
  getOlympicsByCountry(filter: string | number): Observable<any> {
    return this.getOlympicData().pipe(
      map((olympics: Olympic[]) => {
        const country = olympics.find((olympic: Olympic) => {
          if (typeof filter === 'number') {
            return olympic.id === filter;
          }
          // Si c'est une chaîne qui ressemble à un nombre, on compare l'ID
          if (!isNaN(Number(filter))) {
            return olympic.id === Number(filter);
          }
          // Sinon, on compare le nom du pays (insensible à la casse par sécurité)
          return olympic.country.toLowerCase() === filter.toLowerCase();
        });

        if (country) {
          return {
            ...country,
            totalMedals: this.calculateTotalMedals(country.participations),
            totalAthletes: this.calculateTotalAthletes(country.participations),
          };
        }
        return undefined;
      }),
    );
  }

  //   Méthodes privées pour calculer le total des médaille.
  //   Maintenant publique pour être utilisée ailleurs aussi si besoin (ex: HomeComponent)
  calculateTotalMedals(participations: { medalsCount: number }[]): number {
    return participations.reduce(
      (total, participation) => total + participation.medalsCount,
      0,
    );
  }

  //   Méthodes privées pour calculer le total des athlètes.
  private calculateTotalAthletes(
    participations: { athleteCount: number }[],
  ): number {
    return participations.reduce(
      (total, participation) => total + participation.athleteCount,
      0,
    );
  }
}
