import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskExitComponent } from './risk-exit.component';

describe('RiskExitComponent', () => {
  let component: RiskExitComponent;
  let fixture: ComponentFixture<RiskExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskExitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RiskExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
