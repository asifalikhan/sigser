import { Routes, RouterModule }  from '@angular/router';

import { Exams } from './exams.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Exams
  }
];

export const routing = RouterModule.forChild(routes);
