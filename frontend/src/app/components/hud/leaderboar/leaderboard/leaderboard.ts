import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class Leaderboard {
   myMap = new Map<string, string>([
    ['player1', '100'],
    ['player2', '200'],
    ['player3', '-30'],
  ]);
  get mapEntries() {
    return Array.from(this.myMap.entries());
  }

}
