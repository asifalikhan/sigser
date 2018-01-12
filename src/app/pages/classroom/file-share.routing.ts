import { Routes, RouterModule } from '@angular/router';

import { FileshareComponent } from './fileshare.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: FileshareComponent,
    },
];

export const routing = RouterModule.forChild(routes);
