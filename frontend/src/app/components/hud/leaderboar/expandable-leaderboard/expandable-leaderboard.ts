import { Component, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { Leaderboard } from '../leaderboard/leaderboard';

@Component({
  selector: 'app-expandable-leaderboard',
  imports: [MatExpansionModule, Leaderboard, MatIconModule],
  templateUrl: './expandable-leaderboard.html',
  styleUrl: './expandable-leaderboard.css',
})
export class ExpandableLeaderboard {
  isExpanded = signal(true)

  toggleExpand() {
    this.isExpanded.update(v => !v)
  }
}
