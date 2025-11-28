import { Component } from '@angular/core';
import { ExpandableLeaderboard } from '../leaderboar/expandable-leaderboard/expandable-leaderboard';
import { ExpandablePlaceBet } from '../bet/expandable-place-bet/expandable-place-bet';
import { OtherPlayers } from '../players/other-players/other-players';

@Component({
  selector: 'app-head-up-display',
  imports: [ExpandableLeaderboard,ExpandablePlaceBet,OtherPlayers],
  templateUrl: './head-up-display.html',
  styleUrl: './head-up-display.css',
})
export class HeadUpDisplay {

}
