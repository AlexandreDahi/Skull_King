import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class Leaderboard {
  @Input() players: any[] = [];

  // Générer la Map dynamiquement à partir des joueurs
  get myMap(): Map<string, string> {
    const map = new Map<string, string>();
    this.players.forEach((player: any) => {
      map.set(player.name, String(player.score ?? 0));
    });
    return map;
  }

  get mapEntries() {
    return Array.from(this.myMap.entries());
  }
}
