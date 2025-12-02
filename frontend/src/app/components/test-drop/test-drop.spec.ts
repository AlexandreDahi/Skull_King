import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDrop } from './test-drop';

describe('TestDrop', () => {
  let component: TestDrop;
  let fixture: ComponentFixture<TestDrop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDrop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestDrop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
