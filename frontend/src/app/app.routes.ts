import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.HomeComponent),
  },
  {
    path: 'rooms',
    loadComponent: () =>
      import('./pages/room/room').then(m => m.Room),
  }
];
