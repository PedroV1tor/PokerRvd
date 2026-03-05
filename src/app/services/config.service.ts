import { Injectable } from '@angular/core';

export interface AppConfig {
  apiUrl: string;
  hubUrl: string;
}

const DEFAULT_CONFIG: AppConfig = {
  apiUrl: 'http://localhost:5000/api',
  hubUrl: 'http://localhost:5000/hubs/poker'
};

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig = { ...DEFAULT_CONFIG };

  loadConfig(): Promise<AppConfig> {
    const timeout = (ms: number) => new Promise<null>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
    return Promise.race([
      fetch('/config.json').then(res => res.ok ? res.json() : null),
      timeout(5000)
    ])
      .then((data: Partial<AppConfig> | null) => {
        if (data?.apiUrl) this.config.apiUrl = String(data.apiUrl).replace(/\/$/, '');
        if (data?.hubUrl) this.config.hubUrl = String(data.hubUrl).replace(/\/$/, '');
        return this.config;
      })
      .catch(() => this.config);
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get hubUrl(): string {
    return this.config.hubUrl;
  }
}

export function loadConfigFactory(config: ConfigService) {
  return () => config.loadConfig();
}
