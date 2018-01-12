import { Routes, RouterModule }  from '@angular/router';

import { ExamReview } from './examReview.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: ExamReview
  }
];

export const routing = RouterModule.forChild(routes);
