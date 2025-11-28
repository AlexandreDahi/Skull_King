import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableLeaderboard } from './expandable-leaderboard';

describe('ExpandableLeaderboard', () => {
  let component: ExpandableLeaderboard;
  let fixture: ComponentFixture<ExpandableLeaderboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandableLeaderboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpandableLeaderboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
