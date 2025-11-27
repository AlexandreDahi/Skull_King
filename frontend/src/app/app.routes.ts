import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Room } from './pages/room/room';
import { Game } from './pages/game/game';
export const routes: Routes = [
  {path: '', component:HomeComponent,},
  {path: 'room', component:Room,},
  { path : 'game',component: Game },
  {
    path: 'rooms',
    loadComponent: () =>
      import('./pages/room/room').then(m => m.Room),
  },
  { path : 'game/:id',component: Game }
];
