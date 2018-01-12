import { Routes, RouterModule }  from '@angular/router';

import { Newpassword } from './newpassword.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Newpassword
  }
];

export const routing = RouterModule.forChild(routes);
