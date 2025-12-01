import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPlayer } from './other-player';

describe('OtherPlayer', () => {
  let component: OtherPlayer;
  let fixture: ComponentFixture<OtherPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherPlayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherPlayer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
