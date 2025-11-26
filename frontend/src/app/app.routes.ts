import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Room } from './pages/room/room';

export const routes: Routes = [
  {path: '', component:HomeComponent,},
  {path: 'room', component:Room,},
  {
    path: 'game',
    loadComponent: () =>
      import('./pages/game/game').then(m => m.Game),
  }
];
