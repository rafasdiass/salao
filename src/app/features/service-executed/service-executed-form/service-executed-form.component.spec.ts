import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceExecutedFormComponent } from './service-executed-form.component';

describe('ServiceExecutedFormComponent', () => {
  let component: ServiceExecutedFormComponent;
  let fixture: ComponentFixture<ServiceExecutedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceExecutedFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceExecutedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
