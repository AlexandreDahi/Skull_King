import { Component , input, Input, output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-room-card',
  templateUrl: './room-card.html',
  styleUrls: ['./room-card.css'],
  host: { class: 'block' },  
  imports: [MatIconModule],
})

export class RoomCard {
  players = input.required<number>()
  hostName = input.required<string>()
  maxPlayers = input.required<number>()
  roomId = input.required<string>()
  roomNumber = input.required<number>()

  onJoinRoom = output<void>()

}
