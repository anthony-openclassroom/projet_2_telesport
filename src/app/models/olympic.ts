import { Participation } from "./participation";

export interface Olympic {
  id: number;
  country: string;
  participations: Participation[];
}

export interface OlympicCountryStats extends Olympic {
  totalMedals: number;
  totalAthletes: number;
}
