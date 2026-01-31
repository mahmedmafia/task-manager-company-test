import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { StorageService } from '../../../core/services/storage.service';
import { CACHE_TTL_MS } from '../../../core/constants';

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

const CACHE_KEY_STATISTICS = 'statistics';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  storage = inject(StorageService);
  statistics = signal<StatisticsResponse>({ statistics: [], lastUpdated: '' });
  private jsonUrl = 'assets/mocks/statistics.json';

  constructor(private http: HttpClient) {}

  getStatistics() {
    const cached = this.storage.getCached<StatisticsResponse>(CACHE_KEY_STATISTICS);
    if (cached) {
      this.statistics.set(cached);
      return;
    }
    this.http.get<StatisticsResponse>(this.jsonUrl).pipe(
      tap(res => {
        this.statistics.set(res);
        this.storage.setCached(CACHE_KEY_STATISTICS, res, CACHE_TTL_MS);
      })
    ).subscribe();
  }
}
