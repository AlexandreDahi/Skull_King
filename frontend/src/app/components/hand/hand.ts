import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cards } from '../../components/cards/cards';


@Component({
  selector: 'app-hand',
  imports: [CommonModule,Cards],
  templateUrl: './hand.html',
  styleUrl: './hand.css',
})
export class Hand {
  cardIds: number[] = [1,2,3,2,1,0,4,4,1];

  private radius = 700;       // change pour arrondir plus/moins
  
  ComputeArcAngle(card_id_lenght:number): number {
    return (card_id_lenght-1) *7;
  }
  private arcAngle = this.ComputeArcAngle(this.cardIds.length);      // étendue de l’arc en degrés

  ComputeCardXIndex(i: number): number {
    const total = this.cardIds.length;
    const mid = (total - 1) / 2;

    const totalRad = (this.arcAngle * Math.PI) / 180;
    const step = totalRad / (total - 1);

    const angle = -totalRad / 2 + i * step;

    return Math.round(Math.sin(angle) * this.radius);
  }


  ComputeCardYIndex(i: number): number {
    const total = this.cardIds.length;

    const totalRad = (this.arcAngle * Math.PI) / 180;
    const step = totalRad / (total - 1);

    const angle = -totalRad / 2 + i * step;

    // Position verticale (profondeur de l’arc)
    const y = Math.cos(angle) * this.radius;

    // Normalisation : la carte la plus basse = 0px
    return Math.round(y - this.radius);
  }

  ComputeRotateTransform(i: number): string {
    const total = this.cardIds.length;

    const totalRad = (this.arcAngle * Math.PI) / 180;
    const step = totalRad / (total - 1);

    const angle = -totalRad / 2 + i * step;

    // inclinaison liée à l'angle de l'arc
    return `rotate(${(angle * 180) / Math.PI}deg)`;
  }


}