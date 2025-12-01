import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { Navbar } from '../../components/navbar/navbar';
import { RoomService } from '../../service/room/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.html',
  styleUrls: ['./room.css'],
  standalone: true,
  imports: [FormsModule,MatIconModule, Navbar],
})
export class Room {
  name = '';
  hostName = '';
  maxPlayers = 6;

  
  constructor(
    private router: Router,
    private roomsService: RoomService
  ) {}
  
  cancel() {
    this.router.navigate(['/']);
  }
  
  createRoom() {
  this.roomsService.createRoom(this.name, this.hostName).subscribe({
    next: (res) => {
      console.log('Room créée !', res);
      
      const roomId = res.uuid;   

      this.router.navigate(['/game', roomId]);  
    },
    error: (err) => {
      console.error('Erreur de création de room :', err);
    }
  });
}
}



