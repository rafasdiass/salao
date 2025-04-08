import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigEmployeeComponent } from './config-employee.component';

describe('ConfigEmployeeComponent', () => {
  let component: ConfigEmployeeComponent;
  let fixture: ComponentFixture<ConfigEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
