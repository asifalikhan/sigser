import { Routes, RouterModule }  from '@angular/router';

import { Grades } from './grades.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Grades,
  }
];

export const routing = RouterModule.forChild(routes);
