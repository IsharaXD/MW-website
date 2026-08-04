import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalPresence } from './global-presence';

describe('GlobalPresence', () => {
  let component: GlobalPresence;
  let fixture: ComponentFixture<GlobalPresence>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalPresence]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalPresence);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
