import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { configureGlobalTestingModule } from '../test';

describe('AppComponent', () => {
  beforeEach(async () => {
    await configureGlobalTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'task-manager-company-test' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('task-manager-company-test');
  });

});
