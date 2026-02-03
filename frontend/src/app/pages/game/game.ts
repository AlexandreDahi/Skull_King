import { Component, ViewChild, OnInit, OnDestroy, NgZone, inject, signal, WritableSignal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { MatIconModule } from '@angular/material/icon';

import { BehaviorSubject } from 'rxjs';


import { Hand } from '../../components/hand/hand';
import { DropZone } from '../../components/drop-zone/drop-zone';
import data from '../../components/cards/index_carte.json';


import { HeadUpDisplay } from '../../components/hud/head-up-display/head-up-display';

import { webSocketService } from '../../service/websocket/websocket.service';
import { RoomService } from '../../service/room/room.service';
import { PlayerPanel } from '../../components/hud/player-panel/player-panel';


interface Player {
  uuid: string;
  name: string;
  isAdmin?: boolean;
  score?: number;
  bet?: number;
}

interface GameState {
  currentRound: number;
  currentTurn: string; // UUID du joueur dont c'est le tour
  phase: 'BETTING' | 'PLAYING' | 'ROUND_END' | 'GAME_END';
}



@Component({
  selector: 'app-game',
  imports: [Hand,  MatIconModule, HeadUpDisplay, DropZone, PlayerPanel],
  templateUrl: './game.html',
  styleUrl: './game.css',
  standalone: true
})
export class Game implements OnInit, OnDestroy {

  wsService = inject(webSocketService)

  // --- GAME DATA ---  //
  handCards: WritableSignal<number[]> = signal([]);
  dropZoneCards: WritableSignal<number[]> = signal([]);
  nonPlayableCards = computed(() => this.getPlayableCards(this.dropZoneCards()))

  gameStateInfo = signal("")

  round: number = 4;
  totalRounds: number = 10;

  timer: number = 30;
  totalTime: number = 30;
  timerProgress: number = 100;
  intervalId: any;

  score: number = 0;
  scorePopped: boolean = false;
  tricksWon: number = 0; // nombre de plis gagnés
  errorMessage: string ='';




  //timer$ = new BehaviorSubject<number>(this.timer);
  //timerProgress$ = new BehaviorSubject<number>(this.timerProgress);
  


  // Référence à la main du joueur
  @ViewChild(Hand) hand!: Hand;

  /* --- WEBSOCKET DATA (de lobby) --- */
  roomUuid: string = '';
  playerUuid: string = '';
  isAdmin: boolean = false;
  players: Player[] = [];
  gameState: GameState = {
    currentRound: 1,
    currentTurn: '',
    phase: 'BETTING'
  };
  

  /* --- GAME LOGIC DATA (de main) --- */
 

  jsonData = data.index_carte;

  constructor(
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
  ) {}

  /* --------------------------
      INITIALISATION
  ----------------------------*/
  ngOnInit() {
    

    this.wsService.onNewRoundEvent( (message: any) => {

      this.handCards.set(message.hand)
      this.gameStateInfo.set("A vos paris !")

    })

    this.wsService.onAskCardEvent((message: any) => {
      const players = this.wsService.getPlayersName()
      const localPlayer = this.wsService.getPlayerUuid()
      const current_player = message.current_player

      if (current_player === localPlayer) {
        this.gameStateInfo.set("A vous de jouer")
        
      } else {
        for (const player of players) {
          if (player.uuid === current_player) {
            this.gameStateInfo.set("Au tour de " + player.name + " de jouer")
            break
          }
        }
      }
    })



    // 4. 
    //this.startInfiniteTimer();
  }

  /*startInfiniteTimer() {
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
  }*/

  resetTimer() {
    this.timer = this.totalTime;
    this.timerProgress = 100;
  }

  
  
  
  ngOnDestroy() {
    console.log('🧹 Nettoyage du composant Game');

    clearInterval(this.intervalId);
  }


  /* --------------------------
      CARD VALIDATION (de main)
  ----------------------------*/
  getPlayableCards(dropZoneCards: number[]): number[] {
    if (dropZoneCards.length === 0) {
      return [];
    }

    let i = 0;
    let type = this.jsonData.find(c => c.id === dropZoneCards[i])?.type;
    while (type === 'fuite' && i < dropZoneCards.length - 1) {
      i++;
      type = this.jsonData.find(c => c.id === dropZoneCards[i])?.type;
    }

    if (!type) return [];
    if (type === 'special') return [];

    if (this.handCards().filter(id => this.jsonData.find(c => c.id === id)?.type === type).length === 0) return [];

    const allowed = new Set([type, 'special', 'fuite']);
    return this.handCards().filter(id => {
      const t = this.jsonData.find(c => c.id === id)?.type;
      return !(t != null && allowed.has(t));
    });
  }

  
  onCardPlayedError(errorMessage: string) {

    this.errorMessage = errorMessage;
    setTimeout(() => (this.errorMessage = ''), 3000);
  }
}
