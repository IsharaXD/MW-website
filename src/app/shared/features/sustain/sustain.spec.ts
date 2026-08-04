import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sustain } from './sustain';

describe('Sustain', () => {
  let component: Sustain;
  let fixture: ComponentFixture<Sustain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sustain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sustain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
