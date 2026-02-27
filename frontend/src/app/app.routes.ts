import { Routes } from '@angular/router';
import { Home2Component } from './pages/home2/home2';
import { Home3Component } from './pages/home3/home3';
import { Room } from './pages/room/room';
import { JoinRoom } from './pages/join-room/join-room';
import { Game } from './pages/game/game';
import { Lobby } from './pages/lobby/lobby';

export const routes: Routes = [
  {path: '', component:Home3Component,},
];
