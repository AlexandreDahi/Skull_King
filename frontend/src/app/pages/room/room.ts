import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { Navbar } from '../../components/navbar/navbar';
import { RoomService } from '../../service/room/room.service';
import { WebSocketService } from '../../service/websocket/websocket.service';

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
    private roomsService: RoomService,
    private wsService: WebSocketService
  ) {}
  
  cancel() {
    this.router.navigate(['/']);
  }
  
  createRoom() {
    this.roomsService.createRoom(this.name, this.hostName).subscribe({
      next: (res) => {
        console.log('Room créée !', res);
        
        const roomId = res.uuid;
        const playerUuid = res.adminUuid;
        const playerToken = res.adminToken;

        // Connecter au WebSocket en tant qu'admin
        this.wsService.joinRoom(roomId, playerUuid, playerToken, true);

        // Rediriger vers le lobby
        this.router.navigate(['/lobby', roomId]);  
      },
      error: (err) => {
        console.error('Erreur de création de room :', err);
      }
    });
  }
}



