import { Routes, RouterModule }  from '@angular/router';

import { Datesheet } from './datesheet.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Datesheet
  }
];

export const routing = RouterModule.forChild(routes);
