import { Routes, RouterModule }  from '@angular/router';

import { Timetable } from './timetable.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Timetable
  }
];

export const routing = RouterModule.forChild(routes);
