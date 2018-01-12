import { Routes, RouterModule } from '@angular/router';

import { ManageCourses } from './manageCourses.component';
import { Courses } from './components/courses/courses.component';
import { EditCourse } from './components/editCourse/editCourse.component';
import { ViewCourse } from './components/viewCourse/viewCourse.component';
import { MyCourses } from './components/myCourses/myCourses.component';

const routes: Routes = [
  {
    path: '',
    component: ManageCourses,
    children: [
      { path: 'edit_course/:id', component: EditCourse },
      { path: 'view_course/:id', component: ViewCourse },
      { path: 'courses', component: Courses },
      { path: 'my_courses', component: MyCourses }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
