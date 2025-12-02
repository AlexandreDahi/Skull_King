import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cards } from '../../components/cards/cards';
import {CdkDrag,CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-hand',
  imports: [CommonModule, Cards, CdkDrag, CdkDropList, DragDropModule],
  templateUrl: './hand.html',
  styleUrl: './hand.css'
})
export class Hand {
  // Liste des IDs des cartes dans la main (ordre = position)
  cardIds: number[] = [57,58,59,60,61,62,64,65,66,71,72,73,63];
  // cardIds: number[] = [43,44,45,46,47,48,49,50,51,52,53,54,55,56];
  // cardIds: number[] = [29,30,31,32,33,34,35,36,37,38,39,40,41,42];
  // cardIds: number[] = [15,16,17,18,19,20,21,22,23,24,25,26,27,28];
  // cardIds: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
  // cardIds: number[] = [1,15,29,43,57,59];

  private radius = 800;       // change pour arrondir plus/moins en px
  private stepAngleDeg = 5;  // écart angulaire entre chaque carte en degrés

  ComputeArcRad(card_id_lenght:number): number {
    return ((card_id_lenght-1)*this.stepAngleDeg* Math.PI) / 180;
  }
  ComputeStepRad(stepAngleDeg:number): number {
    return (stepAngleDeg * Math.PI) / 180;
  }
  private arcAngleRad = this.ComputeArcRad(this.cardIds.length);
  private stepAngleRad = this.ComputeStepRad(this.stepAngleDeg);
 
  ComputeCardXIndex(i: number): number {
    const angle = -this.arcAngleRad / 2 + i * this.stepAngleRad;
    return Math.round(Math.sin(angle) * this.radius) - 56;
  }

  ComputeCardYIndex(i: number): number {
    const angle = -this.arcAngleRad / 2 + i * this.stepAngleRad;
    // Position verticale (profondeur de l’arc)
    const y = Math.cos(angle) * this.radius ;

    // Normalisation : la carte la plus basse = 0px
    return Math.round(y - this.radius);
  }

  ComputeRotateTransform(i: number): string {
    const angle = -this.arcAngleRad / 2 + i * this.stepAngleRad;
    // inclinaison liée à l'angle de l'arc
    return `rotate(${(angle * 180) / Math.PI}deg)`;
  }

  draggingIndex: number | null = null;
  onDragStateChange(index: number, dragging: boolean) {
    console.log('dragging', dragging);
    if (dragging) {
      this.draggingIndex = index;
    } else {
      // drag terminé → remettre la carte à sa position
      this.resetCardPosition(index);
    }
  }

  moveElement<T>(array: T[], selceted_card_id: number, hoovered_card_id: number): T[] {
    const element = array.splice(selceted_card_id, 1)[0]; // retire l'élément
    array.splice(hoovered_card_id, 0, element);             // insère à la nouvelle position
    return array;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cardIds, event.previousIndex, event.currentIndex);
    console.log('new order', this.cardIds);
  }

  resetCardPosition(index: number) {
    // Ici tu recalcules les positions initiales
    // ou tu forces Angular à recalculer via le binding
    this.arcAngleRad = this.ComputeArcRad(this.cardIds.length);
    this.stepAngleRad = this.ComputeStepRad(this.stepAngleDeg);
    this.ComputeCardXIndex(index);
    this.ComputeCardYIndex(index);
    this.ComputeRotateTransform(index);
  }

  removeCard(cardId: number) {
    const index = this.cardIds.indexOf(cardId);
    if (index !== -1) {
      this.cardIds.splice(index, 1);
      
      // recalcul de l’arc
      this.arcAngleRad = this.ComputeArcRad(this.cardIds.length);
    }
  }
}