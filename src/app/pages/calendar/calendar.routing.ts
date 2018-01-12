import { Routes, RouterModule }  from '@angular/router';

import { Calendar } from './calendar.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Calendar
  }
];

export const routing = RouterModule.forChild(routes);
