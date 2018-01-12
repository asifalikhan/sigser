import { Routes, RouterModule }  from '@angular/router';

import { Assignment } from './assignment.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Assignment
  }
];

export const routing = RouterModule.forChild(routes);
