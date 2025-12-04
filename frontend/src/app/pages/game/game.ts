import { Component, OnInit, NgZone} from '@angular/core';
import { HeadUpDisplay } from '../../components/hud/head-up-display/head-up-display';
import { DropZone } from '../../components/drop-zone/drop-zone';
import { Hand } from '../../components/hand/hand';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PlayerPanel } from '../../components/hud/player-panel/player-panel';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-game',
  imports: [Hand, CommonModule, HeadUpDisplay, DropZone, MatIconModule,PlayerPanel],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game implements OnInit {
  
  /* --- GAME DATA --- */
  handCards: number[] = [24, 3, 15, 65, 42];
  dropZoneCards: number[] = [];

  round: number = 1;
  totalRounds: number = 10;
  phase: string = "Phase d'attente des joueurs"; // affiché en haut

  timer: number = 30;
  totalTime: number = 30;
  timerProgress: number = 100;
  intervalId: any;

  score: number = 0;
  scorePopped: boolean = false;
  tricksWon: number = 0; // nombre de plis gagnés
  
  constructor(private ngZone: NgZone) {}
  /* --------------------------
      INITIALISATION DU TIMER
  ----------------------------*/
  ngOnInit() {
    this.startInfiniteTimer();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

timer$ = new BehaviorSubject<number>(this.timer);
timerProgress$ = new BehaviorSubject<number>(this.timerProgress);

startInfiniteTimer() {
  this.ngZone.run(() => {
    this.intervalId = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        this.timerProgress = (this.timer / this.totalTime) * 100;

        // met à jour les Observables
        this.timer$.next(this.timer);
        this.timerProgress$.next(this.timerProgress);
      } else {
        this.resetTimer();
      }
    }, 1000);
  });
}

resetTimer() {
  this.timer = this.totalTime;
  this.timerProgress = 100;
}

  /* --------------------------
      JOUER UNE CARTE
  ----------------------------*/
  onCardPlayed(cardId: number) {
    this.dropZoneCards.push(cardId);

    const index = this.handCards.indexOf(cardId);
    if (index > -1) this.handCards.splice(index, 1);
  }

  /* --------------------------
      SCORE ANIMATION POP
  ----------------------------*/
  increaseScore(amount: number) {
    this.score += amount;

    this.scorePopped = true;
    setTimeout(() => (this.scorePopped = false), 400);
  }


  /* --------------------------
      GAGNER UN PLI
  ----------------------------*/
  winTrick() {
    this.tricksWon++;
    this.increaseScore(20); // exemple
  }
}

