import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Room } from './pages/room/room';
import { JoinRoom } from './pages/join-room/join-room';
import { Game } from './pages/game/game';
import { Lobby } from './pages/lobby/lobby';
export const routes: Routes = [
  {path: '', component:HomeComponent,},
  {path: 'room', component:Room,},
  { path : 'join-room/:id',component: JoinRoom },
  { path : 'game/:id',component: Game },
  { path : 'lobby/:id',component: Lobby }
];
