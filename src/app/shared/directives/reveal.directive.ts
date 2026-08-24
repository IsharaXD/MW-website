import { Directive, ElementRef, Inject, Input, AfterViewInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  @Input() appRevealDelay: number | string = 0;

  private observer: IntersectionObserver | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.appRevealDelay) {
      this.el.nativeElement.style.animationDelay = `${this.appRevealDelay}ms`;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.el.nativeElement.classList.add('revealed');
          this.observer?.unobserve(this.el.nativeElement);
        }
      });
    }, { threshold: 0.12 });

    // Wait for the router to complete navigation + scroll restoration
    // before we start observing, so elements near the top don't fire
    // prematurely while the page is still scrolled from a previous route.
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      take(1)
    ).subscribe(() => {
      // Extra rAF tick ensures the browser has painted after scroll restore
      requestAnimationFrame(() => {
        if (this.observer) {
          this.observer.observe(this.el.nativeElement);
        }
      });
    });

    // Fallback: if we are already on the final page (no pending navigation),
    // start observing after a short delay so scroll restore can settle.
    setTimeout(() => {
      if (this.observer && !this.el.nativeElement.classList.contains('revealed')) {
        this.observer.observe(this.el.nativeElement);
      }
    }, 250);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
