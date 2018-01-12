import { Routes, RouterModule }  from '@angular/router';

import { Resetpassword } from './resetpassword.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Resetpassword
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
