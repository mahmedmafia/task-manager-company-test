import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksAnalyticsComponent } from './tasks-analytics.component';

describe('TasksAnalyticsComponent', () => {
  let component: TasksAnalyticsComponent;
  let fixture: ComponentFixture<TasksAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksAnalyticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TasksAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
