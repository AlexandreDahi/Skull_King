import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoomCard } from '../../components/room-card/room-card';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [RoomCard],
})
export class HomeComponent {

  constructor(private router: Router) {}

  goToRooms() {
    this.router.navigate(['/rooms']);
  }
}