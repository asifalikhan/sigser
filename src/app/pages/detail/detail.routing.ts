import { Routes, RouterModule }  from '@angular/router';

import { Detail } from './detail.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Detail,
  }
];

export const routing = RouterModule.forChild(routes);
