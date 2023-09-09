import { Routes } from '@angular/router';
import BattleshipLayout from './battleship.layout';

const routes: Routes = [
  { path: '', redirectTo: 'board', pathMatch: 'full' },
  {
    path: '',
    component: BattleshipLayout,
    children: [
      { path: 'board', loadComponent: () => import('./views/board/board.view') }
    ]
  }
];

export default routes;
