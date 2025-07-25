import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDashboardComponent } from './asset-dashboard.component';

describe('AssetDashboardComponent', () => {
  let component: AssetDashboardComponent;
  let fixture: ComponentFixture<AssetDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
