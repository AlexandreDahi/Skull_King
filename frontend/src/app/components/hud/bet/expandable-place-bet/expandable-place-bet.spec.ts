import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandablePlaceBet } from './expandable-place-bet';

describe('ExpandablePlaceBet', () => {
  let component: ExpandablePlaceBet;
  let fixture: ComponentFixture<ExpandablePlaceBet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandablePlaceBet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpandablePlaceBet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
