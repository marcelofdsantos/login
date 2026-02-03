import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { Checklist } from './pages/checklist/checklist';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'checklist', component: Checklist, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
