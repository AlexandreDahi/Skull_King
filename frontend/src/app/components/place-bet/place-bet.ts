import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../service/store/store.service';

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
