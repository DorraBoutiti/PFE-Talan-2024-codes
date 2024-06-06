import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AccessRequestListComponent } from './pages/access-request-list/access-request-list.component';
import { UpdateProfileComponent } from './pages/profile/updateProfile/updateProfile.component';
import { UpdatePasswordComponent } from './pages/profile/updatePassword/updatePassword.component';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RiskExitComponent } from './pages/risk-exit/risk-exit.component';
import { EmployeesListComponent } from './pages/employees-list/employees-list.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './service/auth-guard.service';
import { RoleGuard } from './service/role-guard.service';
import { AlertComponent } from './pages/alert/alert.component';
import { PayEquityComponent } from './pages/pay-equity/pay-equity.component';
import { UpdateEmailComponent } from './pages/profile/update-email/update-email.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'access-request-list', component: AccessRequestListComponent },
      { path: 'risk-exit', component: RiskExitComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'update-profile', component: UpdateProfileComponent },
      { path: 'update-email', component: UpdateEmailComponent },
      { path: 'update-password', component: UpdatePasswordComponent },
      { path: 'users', component: UsersComponent },
      { path: 'employees-list', component: EmployeesListComponent },
      { path: 'pay-equity', component: PayEquityComponent },
      { path: 'alert', component: AlertComponent }
    ]
  },
  { path: '**', redirectTo: 'auth' }
];
