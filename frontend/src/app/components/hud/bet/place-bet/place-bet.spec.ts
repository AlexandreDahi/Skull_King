import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceBet } from './place-bet';

describe('PlaceBet', () => {
  let component: PlaceBet;
  let fixture: ComponentFixture<PlaceBet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceBet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceBet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
