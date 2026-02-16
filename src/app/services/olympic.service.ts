import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Olympic } from '../models/olympic';
import { KPI } from '../models/kpi';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';

  //    Ici, BehaviorSubject est utilisé pour stocker et émettre les données.
  private titleSubject = new BehaviorSubject<string>('');
  //    Et la ligne du dessous expose ces données sous forme d'Observable pour que les composants puissent s'y abonner et réagir aux changements.
  public title$ = this.titleSubject.asObservable();

  private kpisSubject = new BehaviorSubject<KPI[]>([]);
  public kpis$ = this.kpisSubject.asObservable();

  constructor(private http: HttpClient) {}

  //   Méthode pour mettre à jour le titre et les KPIs du header
  updateHeaderData(title: string, kpis: KPI[]) {
    //   La méthode next() est utilisée pour émettre de nouvelles valeurs aux abonnés de ces BehaviorSubjects, ce qui déclenche la mise à jour du header dans les composants abonnés.
    this.titleSubject.next(title);
    this.kpisSubject.next(kpis);
  }

  getOlympicData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl);
  }

  //   Méthode pour récupérer les données d'un pays spécifique et calculer les KPIs associés
  getOlympicsByCountry(countryName: string): Observable<any> {
    return this.getOlympicData().pipe(
      map((olympics: Olympic[]) => {
        const country = olympics.find(
          (olympic: Olympic) => olympic.country === countryName,
        );
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
