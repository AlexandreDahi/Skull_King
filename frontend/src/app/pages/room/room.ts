import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-room',
  templateUrl: './room.html',
  styleUrls: ['./room.css'],
  standalone: true,
  imports: [FormsModule,MatIconModule, Navbar],
})
export class Room {
  name = '';
  maxPlayers = 6;

  constructor(private router: Router) {}

  createRoom() {
    console.log('Création de room : ', this.name, this.maxPlayers);

    // plus tard l'appel API ici
    // this.roomsService.createRoom(...)

    this.router.navigate(['/']);
  }

  cancel() {
    this.router.navigate(['/']);
  }


}