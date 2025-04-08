import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigClientsComponent } from './config-clients.component';

describe('ConfigClientsComponent', () => {
  let component: ConfigClientsComponent;
  let fixture: ComponentFixture<ConfigClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
