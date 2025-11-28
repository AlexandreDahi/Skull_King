import { Component } from '@angular/core';
import { PlaceBet } from '../place-bet/place-bet';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expandable-place-bet',
  imports: [MatExpansionModule, PlaceBet,MatIconModule,CommonModule],
  templateUrl: './expandable-place-bet.html',
  styleUrl: './expandable-place-bet.css',
})
export class ExpandablePlaceBet {
  isExpanded = false;
    toggleExpand() {
      console.log("expanding place bet");
      this.isExpanded = !this.isExpanded;
    }
}
