import { Component, inject, Input, model, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { webSocketService } from '../../../../service/websocket/websocket.service';

@Component({
  selector: 'app-place-bet',
  imports: [ MatCardModule,FormsModule,MatIconModule, MatSliderModule ,MatButtonModule,CommonModule],
  templateUrl: './place-bet.html',
  styleUrl: './place-bet.css',
})
export class PlaceBet {

  private wsService = inject(webSocketService) 
  

  bet = signal(0)
  private maxBet: number = 10;
  private minBet: number = 0;

  isExpended = model.required<boolean>()

  placeBet() {
    this.wsService.sendBet(this.bet())
    this.isExpended.set(false)
  }

  increase() {
    if (this.bet() < this.maxBet){
      this.bet.update(value => value + 1)
    }

  }
  decrease() {
    if (this.bet() > this.minBet){
      this.bet.update(value => value - 1);
    }

  }
}
