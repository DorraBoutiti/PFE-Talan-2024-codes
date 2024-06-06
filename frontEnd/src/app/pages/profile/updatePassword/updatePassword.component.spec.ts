import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePasswordComponent } from './updatePassword.component';

describe('ProfileComponent', () => {
  let component: UpdatePasswordComponent;
  let fixture: ComponentFixture<UpdatePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
