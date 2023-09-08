import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'battleship', pathMatch: 'full' },
  { path: 'battleship', loadComponent: () => import('./battleship/battleship.component') }
];
