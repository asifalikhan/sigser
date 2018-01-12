import { Routes, RouterModule }  from '@angular/router';

import { Services } from './services.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Services
  }
];

export const routing = RouterModule.forChild(routes);
