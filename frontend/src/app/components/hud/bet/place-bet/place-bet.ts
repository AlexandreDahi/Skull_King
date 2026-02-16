import { Component, inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../../../service/websocket/websocket.service';

@Component({
  selector: 'app-place-bet',
  imports: [ MatCardModule,FormsModule,MatIconModule, MatSliderModule ,MatButtonModule,CommonModule],
  templateUrl: './place-bet.html',
  styleUrl: './place-bet.css',
})
export class PlaceBet implements OnInit {
  private wsService = inject(WebSocketService) 

  @Input() player: any;
  @Output() betChanged = new EventEmitter<number>();
  
  value: number = 0;
  private maxBet: number = 10;
  private minBet: number = 0;

  ngOnInit() {
    // Initialiser la mise depuis le player si elle existe déjà
    if (this.player?.bet !== undefined ) {
      this.value = this.player.bet;
    }
  }

  get resultClass(): string {
    if (this.value === this.player?.bet) {
      return 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,1)]'; // ombre verte
    }
    if (this.value < this.player?.bet) {
      return 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]'; // ombre rouge
    }
    return 'text-white';
  }
  placeBet() {
    // Émettre l'événement au parent
    this.betChanged.emit(this.value);
  }

  increase() {
    if (this.value < this.maxBet){
      this.value++;
    }

  }
  decrease() {
    if (this.value > this.minBet){
      this.value--;
    }

  }
}
