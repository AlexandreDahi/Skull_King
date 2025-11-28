import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadUpDisplay } from './head-up-display';

describe('HeadUpDisplay', () => {
  let component: HeadUpDisplay;
  let fixture: ComponentFixture<HeadUpDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadUpDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadUpDisplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
