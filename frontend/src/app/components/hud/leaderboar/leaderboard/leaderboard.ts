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
  @Input() player: any;

  // Générer la Map dynamiquement à partir des joueurs
  get myMap(): Map<string, string> {
    const map = new Map<string, string>();
    this.players.forEach((player: any) => {
      map.set(player.name, String(player.score ?? 0));
    });
    map.set(this.player.name, String(this.player.score ?? 0)); // Assurez-vous d'inclure le joueur actuel
    return map;
  }

  get mapEntries() {
    return Array.from(this.myMap.entries()).sort((a, b) => {
      return Number(b[1]) - Number(a[1]);
    });
  }
}
