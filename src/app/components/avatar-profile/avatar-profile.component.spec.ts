import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarProfileComponent } from './avatar-profile.component';
import { configureGlobalTestingModule } from '../../../test';

describe('AvatarProfileComponent', () => {
  let component: AvatarProfileComponent;
  let fixture: ComponentFixture<AvatarProfileComponent>;

  beforeEach(async () => {
    await configureGlobalTestingModule({
      imports: [AvatarProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
