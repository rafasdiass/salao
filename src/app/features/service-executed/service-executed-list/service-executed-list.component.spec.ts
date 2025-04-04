import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceExecutedListComponent } from './service-executed-list.component';

describe('ServiceExecutedListComponent', () => {
  let component: ServiceExecutedListComponent;
  let fixture: ComponentFixture<ServiceExecutedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceExecutedListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceExecutedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
