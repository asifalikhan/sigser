import { Routes, RouterModule }  from '@angular/router';

import { Groups } from './groups.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Groups
  }
];

export const routing = RouterModule.forChild(routes);
