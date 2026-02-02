import { Component, ViewChild, OnInit, OnDestroy, NgZone, inject, signal, WritableSignal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


import { MatIconModule } from '@angular/material/icon';

import { Subscription, BehaviorSubject } from 'rxjs';


import { Hand } from '../../components/hand/hand';
import { DropZone } from '../../components/drop-zone/drop-zone';
import data from '../../components/cards/index_carte.json';


import { HeadUpDisplay } from '../../components/hud/head-up-display/head-up-display';
import { PlayerPanel } from '../../components/hud/player-panel/player-panel';

import { webSocketService } from '../../service/websocket/websocket.service';
import { RoomService } from '../../service/room/room.service';



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
  imports: [Hand, CommonModule,  MatIconModule, PlayerPanel, HeadUpDisplay, DropZone],
  templateUrl: './game.html',
  styleUrl: './game.css',
  standalone: true
})
export class Game implements OnInit, OnDestroy {

  wsService = inject(webSocketService)

  // --- GAME DATA ---  //
  handCards: WritableSignal<number[]> = signal([]);
  dropZoneCards: WritableSignal<number[]> = signal([]);
  nonPlayableCards = computed(() => this.getPlayableCards(this.dropZoneCards())
  )

  gameStateInfo = signal("")

  round: number = 4;
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




  timer$ = new BehaviorSubject<number>(this.timer);
  timerProgress$ = new BehaviorSubject<number>(this.timerProgress);
  


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
  
  // Abonnements WebSocket
  private gameSubscription?: Subscription;
  private publicSubscription?: Subscription;
  private isDestroyed = false;

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
    // 1. WebSocket setup (de lobby)

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
    this.startInfiniteTimer();
  }

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


  onCardDropped(cardId: number) {
    console.log("🃏 Carte déposée :", cardId);
    
    // Vérifier que c'est bien le tour du joueur
    if (this.gameState.currentTurn !== this.playerUuid) {
      console.warn('⚠️ Ce n\'est pas votre tour !');
      // TODO: Afficher un message d'erreur
      return;
    }

    // Envoyer la carte jouée au serveur via WebSocket
    

    // Retirer la carte de la main
    //this.hand.removeCard(cardId);
  }

  
  onBetPlaced(betAmount: number) {
    console.log('💰 Pari placé:', betAmount);

    
    const currentPlayer = this.players.find(p => p.uuid === this.playerUuid);
    if (currentPlayer) {
      currentPlayer.bet = betAmount;
    }

    this.gameState.phase = 'PLAYING';
  }

  
  leaveGame() {
    console.log('👋 Quitter la partie');
    
    

    this.router.navigate(['/']);
  }

  
  isMyTurn(): boolean {
    return this.gameState.currentTurn === this.playerUuid;
  }

  
  getCurrentPlayerName(): string {
    const player = this.players.find(p => p.uuid === this.gameState.currentTurn);
    return player ? player.name : 'Inconnu';
  }

  
  ngOnDestroy() {
    console.log('🧹 Nettoyage du composant Game');
    this.isDestroyed = true;

    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
    if (this.publicSubscription) {
      this.publicSubscription.unsubscribe();
    }


    clearInterval(this.intervalId);
  }

  // --------------------------
  //    JOUER UNE CARTE
  //----------------------------
  onCardPlayed(cardId: number) {

    console.log("COUCOU")
    // Vérifier que c'est le tour du joueur (WebSocket)
    if (this.gameState.currentTurn !== this.playerUuid) {
      console.warn('⚠️ Ce n\'est pas votre tour !');
      return;
    }

    // Logique locale
    this.dropZoneCards.update((v) => {
      v.push(cardId)
      return v
    })
    const index = this.handCards().indexOf(cardId);
    if (index > -1) this.handCards().splice(index, 1);

    this.handCards.update(v => v)
    
  }

 
  // --------------------------
  //    SCORE ANIMATION POP
  //----------------------------
  increaseScore(amount: number) {
    this.score += amount;
    this.scorePopped = true;
    setTimeout(() => (this.scorePopped = false), 400);
  }


  // --------------------------
  //    GAGNER UN PLI
  //----------------------------
  winTrick() {
    this.tricksWon++;
    this.increaseScore(20);
  }
  // --------------------------
  //    Restreint les cartes jouables
  //----------------------------
  

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

  /*get nonPlayableCards(): number[] {
    return this.getPlayableCards(this.dropZoneCards());
  }*/

  onCardPlayedError(errorMessage: string) {
    this.errorMessage = errorMessage;
    setTimeout(() => (this.errorMessage = ''), 3000);
  }
}
