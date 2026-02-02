import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSectionComponent } from './chart-section.component';
import { configureGlobalTestingModule } from '../../../../test';

describe('ChartSectionComponent', () => {
  let component: ChartSectionComponent;
  let fixture: ComponentFixture<ChartSectionComponent>;

  beforeEach(async () => {
    await configureGlobalTestingModule({
      imports: [ChartSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
