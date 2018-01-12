import { Routes, RouterModule }  from '@angular/router';

import { Attendence } from './attendence.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Attendence
  }
];

export const routing = RouterModule.forChild(routes);
