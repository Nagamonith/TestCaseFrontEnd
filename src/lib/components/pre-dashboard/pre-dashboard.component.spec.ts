import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreDashboardComponent } from './pre-dashboard.component';

describe('PreDashboardComponent', () => {
  let component: PreDashboardComponent;
  let fixture: ComponentFixture<PreDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
