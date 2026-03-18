import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortButtons } from './sort-buttons';

describe('SortButtons', () => {
  let component: SortButtons;
  let fixture: ComponentFixture<SortButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortButtons],
    }).compileComponents();

    fixture = TestBed.createComponent(SortButtons);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
