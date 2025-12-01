import { Component , Input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-card',
  templateUrl: './room-card.html',
  styleUrls: ['./room-card.css'],
  host: { class: 'block' },  
  imports: [MatIconModule],
})

export class RoomCard {
  @Input() title!: string;
  @Input() players!: number;
  @Input() hostName!: string;
  @Input() maxPlayers!: number;
  @Input() roomId!: number;       // <-- important pour l’URL
  @Input() roomNumber!: number;

  constructor(private router: Router) {}

  joinRoom() {
    this.router.navigate(
      ['join-room/', this.roomId],      // mettre roomId dans l’URL
      {
        queryParams: {
          title: this.title,
          host: this.hostName,
          players: this.players,
          maxPlayers: this.maxPlayers
        }
      }
    );
  }
}
