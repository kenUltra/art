import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Workui } from './workui';

describe('Workui', () => {
  let component: Workui;
  let fixture: ComponentFixture<Workui>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Workui]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Workui);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
