import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-player-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './player-panel.html',
  styleUrls: ['./player-panel.css'],
})
export class PlayerPanel {
  @Input() round!: number;
  @Input() totalRounds!: number;
  @Input() timer$!: Observable<number>;
  @Input() timerProgress$!: Observable<number>;
  @Input() tricksWon!: number;
  @Input() score!: number;
  @Input() scorePopped!: boolean;

  /**
   * Retourne un gradient dynamique selon le pourcentage du timer
   * Vert > 50% | Jaune 25-50% | Rouge < 25%
   */
  getTimerGradient(progress: number, percentage: number): string {
    let color: string;
    
    if (progress > 50) {
      // Vert
      color = '#4ade80'; // green-400
    } else if (progress > 33) {
      // Jaune
      color = '#facc15'; // yellow-400
    } else {
      // Rouge
      color = '#f87171'; // red-400
    }
    
    return `conic-gradient(${color} ${percentage}%, transparent 0)`;
  }
}