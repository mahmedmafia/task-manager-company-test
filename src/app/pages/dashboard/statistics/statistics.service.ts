import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Stat {
  id: string;
  title: string;
  icon: string;
  value: number;
  change: string;
  changeLabel: string;
  changeType: 'positive' | 'negative' | 'neutral';
  color: string;
}

export interface StatisticsResponse {
  statistics: Stat[];
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {

  private jsonUrl = 'assets/mocks/statistics.json';

  constructor(private http: HttpClient) {}

  getStatistics(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>(this.jsonUrl);
  }
}
