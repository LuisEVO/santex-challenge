import { Routes } from '@angular/router';
import BattleshipLayout from './battleship.layout';

const routes: Routes = [
  { path: '', redirectTo: 'setup', pathMatch: 'full' },
  {
    path: '',
    component: BattleshipLayout,
    children: [
      { path: 'setup', loadComponent: () => import('./views/setup/setup.component') },
      { path: 'board', loadComponent: () => import('./views/board/board.view') },
      { path: 'history', loadComponent: () => import('./views/history/history.component') },
    ]
  }
];

export default routes;
