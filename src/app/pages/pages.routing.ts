import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'resetpassword',
    loadChildren: 'app/pages/resetpassword/resetpassword.module#ResetpasswordModule'
  },
  {
    path: 'newpassword/:id',
    loadChildren: 'app/pages/newpassword/newpassword.module#NewpasswordModule'
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'users', loadChildren: './users/users.module#UsersModule' },
      { path: 'users/:id', loadChildren: './detail/detail.module#DetailModule' },
      { path: 'groups', loadChildren: './groups/groups.module#GroupsModule' },
      { path: 'attendence', loadChildren: './attendence/attendence.module#AttendenceModule' },
      { path: 'exams', loadChildren: './exams/exams.module#ExamsModule' },
      { path: 'examToTake', loadChildren: './examToTake/examToTake.module#ExamToTakeModule' },
      { path: 'examReview/:id', loadChildren: './examReview/examReview.module#ExamReviewModule' },
      { path: 'timetable', loadChildren: './timetable/timetable.module#TimetableModule' },
      { path: 'datesheet', loadChildren: './datesheet/datesheet.module#DatesheetModule' },
      { path: 'assignment', loadChildren: './assignment/assignment.module#AssignmentModule' },
      { path: 'calendar', loadChildren: './calendar/calendar.module#CalendarModule' },
      { path: 'services', loadChildren: './services/services.module#ServicesModule' },
      { path: 'account', loadChildren: './account/account.module#AccountsModule' },
      { path: 'manage_courses', loadChildren: './manageCourses/manageCourses.module#ManageCoursesModule' },
      { path: 'batches', loadChildren: './batches/batches.module#BatchesModule' },
      { path: 'grades', loadChildren: './grades/grades.module#GradesModule' },
      { path: 'live_room', loadChildren: './classroom/file-share.module#FileShareModule' },
      { path: 'class_room', loadChildren: './file-share/file-share.module#FileShareModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
