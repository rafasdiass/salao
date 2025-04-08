import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsEmployeeComponent } from './appointments-employee.component';

describe('AppointmentsEmployeeComponent', () => {
  let component: AppointmentsEmployeeComponent;
  let fixture: ComponentFixture<AppointmentsEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentsEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
