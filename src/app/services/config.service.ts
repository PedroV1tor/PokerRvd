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
    return fetch('/config.json')
      .then(res => res.ok ? res.json() : null)
      .then((data: Partial<AppConfig> | null) => {
        if (data?.apiUrl) this.config.apiUrl = data.apiUrl.replace(/\/$/, '');
        if (data?.hubUrl) this.config.hubUrl = data.hubUrl.replace(/\/$/, '');
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
