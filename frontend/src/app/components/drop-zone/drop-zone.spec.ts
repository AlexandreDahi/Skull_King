import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropZone } from './drop-zone';

describe('DropZone', () => {
  let component: DropZone;
  let fixture: ComponentFixture<DropZone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropZone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropZone);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
