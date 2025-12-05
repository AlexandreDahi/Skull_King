import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../../../service/store/store.service';

@Component({
  selector: 'app-place-bet',
  imports: [ MatCardModule,FormsModule,MatIconModule, MatSliderModule ,MatButtonModule,CommonModule],
  templateUrl: './place-bet.html',
  styleUrl: './place-bet.css',
})
export class PlaceBet {
  constructor(private storeService:StoreService){
    this.isBetPlaced = storeService.getIsBetPlaced()
    this.value = storeService.getBet();
  }

  value :number ;
  private maxBet : number = 10;
  private minBet : number = 0;
  isBetPlaced : boolean;

  @Input() bet: number = 2;        // pari (annonce)

  get resultClass(): string {
    if (this.value === this.bet) {
      return 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,1)]'; // ombre verte
    }
    if (this.value < this.bet) {
      return 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]'; // ombre rouge
    }
    return 'text-white';
  }
  placeBet() {
    this.isBetPlaced = true;
    this.storeService.setIsBetPlaced(true);
    this.storeService.setBet(this.value);
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
