import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

<<<<<<< HEAD
=======

>>>>>>> 63b7f755d719aa2dc2145748d796b4dee8268806
describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

<<<<<<< HEAD
  it(`should have the 'visitor-management-system' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('visitor-management-system');
  });
=======
>>>>>>> 63b7f755d719aa2dc2145748d796b4dee8268806

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, visitor-management-system');
  });
});
