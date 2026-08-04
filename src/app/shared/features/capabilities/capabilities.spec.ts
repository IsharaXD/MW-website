import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Capabilities } from './capabilities';

describe('Capabilities', () => {
  let component: Capabilities;
  let fixture: ComponentFixture<Capabilities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Capabilities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Capabilities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
