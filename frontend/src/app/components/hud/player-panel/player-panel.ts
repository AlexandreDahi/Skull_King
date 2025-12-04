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
}