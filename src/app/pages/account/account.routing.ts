import { Routes, RouterModule } from '@angular/router';

import { Account } from './account.component';
import { Profile } from './components/profile/profile.component';
import { Info } from './components/info/info.component';
import { Viewprofile } from './components/viewprofile/viewprofile.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Account,
    children: [
      { path: 'profile', component: Profile },
      { path: 'profile/:id', component: Profile },
      { path: 'general_info', component: Info },
      { path: 'view_profile', component: Viewprofile },
      { path: 'view_profile/:id', component: Viewprofile }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
