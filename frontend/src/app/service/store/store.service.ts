import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private isBetPlacedSource = new BehaviorSubject<boolean>(false);
  isBetPlaced$ = this.isBetPlacedSource.asObservable();

  private betSource = new BehaviorSubject<number>(0)
  bet$ = this.betSource.asObservable();

  
  public getIsBetPlaced(): boolean {
    return this.isBetPlacedSource.value;
  }
  public setIsBetPlaced(isBetPlaced: boolean) {
    this.isBetPlacedSource.next(isBetPlaced);
  }

  public setBet(bet : number){
    this.betSource.next(bet);
  }
  public getBet(){
    return this.betSource.value;
  }

}
