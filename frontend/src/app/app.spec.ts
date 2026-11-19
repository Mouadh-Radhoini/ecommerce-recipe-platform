import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app';

describe('Recipe Marketplace', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppComponent],
    providers: [provideRouter([])],
  }));

  it('renders the application shell and routed content outlet', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('app-header')?.textContent).toContain('Recipe Marketplace');
    expect(root.querySelector('main router-outlet')).toBeTruthy();
    expect(root.querySelector('app-footer')).toBeTruthy();
  });

  it('offers sign-in and registration links to visitors', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('a[href="/auth/login"]')).toBeTruthy();
    expect(root.querySelector('a[href="/auth/register"]')).toBeTruthy();
  });
});
