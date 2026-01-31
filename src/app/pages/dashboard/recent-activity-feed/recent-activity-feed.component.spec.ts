import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentActivityFeedComponent } from './recent-activity-feed.component';

describe('RecentActivityFeedComponent', () => {
  let component: RecentActivityFeedComponent;
  let fixture: ComponentFixture<RecentActivityFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentActivityFeedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecentActivityFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
