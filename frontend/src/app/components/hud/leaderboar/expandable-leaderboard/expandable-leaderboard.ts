import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Leaderboard } from '../leaderboard/leaderboard';

@Component({
  selector: 'app-expandable-leaderboard',
  imports: [MatExpansionModule, Leaderboard, MatIconModule, CommonModule],
  templateUrl: './expandable-leaderboard.html',
  styleUrl: './expandable-leaderboard.css',
})
export class ExpandableLeaderboard {
  isExpanded = true;
  toggleExpand() {
    console.log("expanding place bet");
    this.isExpanded = !this.isExpanded;
  }
}
