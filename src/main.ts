import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Segurança: em produção (não localhost) desabilita logs no console para não expor dados
if (typeof window !== 'undefined') {
  const isLocalhost = /localhost|127\.0\.0\.1/i.test(window.location.hostname);
  if (!isLocalhost) {
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.warn = () => {};
    console.error = () => {};
  }
}

bootstrapApplication(AppComponent, appConfig)
  .catch(() => {});
