import { Component, OnInit, NgZone} from '@angular/core';
import { HeadUpDisplay } from '../../components/hud/head-up-display/head-up-display';
import { DropZone } from '../../components/drop-zone/drop-zone';
import { Hand } from '../../components/hand/hand';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PlayerPanel } from '../../components/hud/player-panel/player-panel';
import { BehaviorSubject } from 'rxjs';
import data from '../../components/cards/index_carte.json';

@Component({
  selector: 'app-game',
  imports: [Hand, CommonModule, HeadUpDisplay, DropZone, MatIconModule,PlayerPanel],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game implements OnInit {
  
  /* --- GAME DATA --- */
  handCards: number[] = [24, 3, 15, 65, 42,68,72,4,8,12];
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
  errorMessage: string ='';
  
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
  /* --------------------------
      Restreint les cartes jouables
  ----------------------------*/
  jsonData = data.index_carte;

  getPlayableCards(dropZoneCards: number[]): number[] {
    if (dropZoneCards.length === 0) {
      return [];
    }
    // cherche le premier type non 'fuite' parmi les cartes du drop zone (si toutes 'fuite', on garde la dernière trouvée)
    let i = 0;
    let type = this.jsonData.find(c => c.id === dropZoneCards[i])?.type;
    while (type === 'fuite' && i < dropZoneCards.length - 1) {
      i++;
      type = this.jsonData.find(c => c.id === dropZoneCards[i])?.type;
    }

    if (!type) return [];

    if (type === 'special') return [];

    // ...existing code...
    if (this.handCards.filter(id => this.jsonData.find(c => c.id === id)?.type === type).length === 0) return [];

    // autorise les cartes du même type que la carte leader + toujours 'speciale' et 'fuite'
    const allowed = new Set([type, 'special', 'fuite']);
    return this.handCards.filter(id => {
      const t = this.jsonData.find(c => c.id === id)?.type;
      return !(t != null && allowed.has(t));
    });
  }
  get nonPlayableCards(): number[] {
    return this.getPlayableCards(this.dropZoneCards);
  }

  onCardPlayedError(errorMessage: string) {
    this.errorMessage = errorMessage;
    // Optionnel : effacer le message après 3 secondes
    setTimeout(() => (this.errorMessage = ''), 3000);
  }
}
