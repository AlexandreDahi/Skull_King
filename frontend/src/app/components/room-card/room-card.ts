import { Component , Input} from '@angular/core';

@Component({
  selector: 'app-room-card',
  templateUrl: './room-card.html',
  styleUrls: ['./room-card.css'],
  host: { class: 'block' }  
})

export class RoomCard {
  @Input() title!: string ;
  @Input() players!: number;
  @Input() maxPlayers!: number;
}
