import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayEquityComponent } from './pay-equity.component';

describe('PayEquityComponent', () => {
  let component: PayEquityComponent;
  let fixture: ComponentFixture<PayEquityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayEquityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayEquityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
