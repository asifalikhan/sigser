import { Routes, RouterModule }  from '@angular/router';

import { ExamToTake } from './examToTake.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: ExamToTake
  }
];

export const routing = RouterModule.forChild(routes);
