import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPlayers } from './other-players';

describe('OtherPlayers', () => {
  let component: OtherPlayers;
  let fixture: ComponentFixture<OtherPlayers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherPlayers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherPlayers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
