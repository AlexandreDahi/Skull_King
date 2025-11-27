import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Room } from './pages/room/room';
import { JoinRoom } from './pages/join-room/join-room';
import { Game } from './pages/game/game';
export const routes: Routes = [
  {path: '', component:HomeComponent,},
  {path: 'room', component:Room,},
  { path : 'join-room/:id',component: JoinRoom },
  { path : 'game',component: Game },

  { path : 'game/:id',component: Game }
];
