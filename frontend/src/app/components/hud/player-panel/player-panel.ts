import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { webSocketService } from '../../../service/websocket/websocket.service';

import { DateTime } from 'luxon';

@Component({
  selector: 'app-player-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './player-panel.html',
  styleUrls: ['./player-panel.css'],
})
export class PlayerPanel {

  @Input() totalRounds!: number;
  @Input() timer$!: Observable<number>;
  @Input() timerProgress$!: Observable<number>;
  @Input() tricksWon!: number;
  @Input() score!: number;
  @Input() scorePopped!: boolean;


  round = signal(1)

  timeRemaining = signal(0)
  initialRemaining = 0
  percentageRemaining = 0.0
  intervalRef: NodeJS.Timeout | undefined = undefined
  
  wsService = inject(webSocketService)

  ngOnInit() {

    this.wsService.onNewRoundEvent((message: any) => {

      this.round.set(message.hand.length)

      const deadline = DateTime.fromISO(message.bet_end_time)

      this.initialRemaining = deadline.diffNow().as("seconds")
      this.timeRemaining.set(Math.ceil(this.initialRemaining))
      this.percentageRemaining = 1.0

      clearInterval(this.intervalRef)
      this.intervalRef = setInterval(() => {

        const remaining =  deadline.diffNow().as("seconds")

        this.percentageRemaining = remaining / this.initialRemaining

        if (remaining > 0) {
          this.timeRemaining.set(Math.ceil(remaining))
        } 
        else {
          this.timeRemaining.set(0)
          clearInterval(this.intervalRef)
          this.intervalRef = undefined
        }

      }, 1000)
    })


    //this.wsService.onAskCardEvent
  }

  ngOnDestroy() {
    clearInterval(this.intervalRef)
  }

  /**
   * Retourne un gradient dynamique selon le pourcentage du timer
   * Vert > 50% | Jaune 25-50% | Rouge < 25%
   */
  getTimerGradient(): string {
    let color: string;

    if (this.percentageRemaining > 0.5) {
      // Vert
      color = '#4ade80'; // green-400
    } else if (this.percentageRemaining > 0.33) {
      // Jaune
      color = '#facc15'; // yellow-400
    } else {
      // Rouge
      color = '#f87171'; // red-400
    }

    const percentage = Math.floor(this.percentageRemaining * 100)
    return `conic-gradient(${color} ${percentage}%, transparent 0)`;
  }
}
