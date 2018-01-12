import { Routes, RouterModule } from '@angular/router';

import { Batches } from './batches.component';
import { AllBatches } from './components/allBatches/allBatches.component';
import { EditBatch } from './components/editBatch/editBatch.component';

const routes: Routes = [
  {
    path: '',
    component: Batches,
    children: [
      { path: '', component: AllBatches },
      { path: 'edit/:id', component: EditBatch }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
