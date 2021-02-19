import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Prototypes } from 'src/app/utils/prototypes';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

Prototypes.init();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
