import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KPI } from '../models/kpi';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  //    Ici, BehaviorSubject est utilisé pour stocker et émettre les données.
  private titleSubject = new BehaviorSubject<string>('');
  //    Et la ligne du dessous expose ces données sous forme d'Observable pour que les composants puissent s'y abonner et réagir aux changements.
  public title$ = this.titleSubject.asObservable();

  private kpisSubject = new BehaviorSubject<KPI[]>([]);
  public kpis$ = this.kpisSubject.asObservable();

  constructor() {}

  //   Méthode pour mettre à jour le titre et les KPIs du header
  updateHeaderData(title: string, kpis: KPI[]) {
    //   La méthode next() est utilisée pour émettre de nouvelles valeurs aux abonnés de ces BehaviorSubjects, ce qui déclenche la mise à jour du header dans les composants abonnés.
    this.titleSubject.next(title);
    this.kpisSubject.next(kpis);
  }
}
