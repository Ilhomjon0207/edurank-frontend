import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Criterion } from './criterion';

describe('Criterion', () => {
  let component: Criterion;
  let fixture: ComponentFixture<Criterion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Criterion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Criterion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
