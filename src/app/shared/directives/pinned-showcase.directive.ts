import {
  Directive,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  NgZone,
  Renderer2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Pins the section in place while the user scrolls, and translates a
// horizontal track of items past a fixed center point — whichever item
// is currently nearest center gets `.is-active`. Expects this structure
// inside the host element:
//   .pin-showcase__inner        (sticky container, position:sticky top:96px)
//     .pin-showcase__stage      (overflow:hidden viewport for the track)
//       .pin-showcase__track    (flex row, translated horizontally)
//         .pin-item ...         (the cards being cycled through)
//
// Disabled below 860px — scroll-jacking on small screens is fragile and
// the CSS falls back to a normal static grid there instead.
@Directive({
  selector: '[appPinnedShowcase]',
  standalone: true,
})
export class PinnedShowcaseDirective implements AfterViewInit, OnDestroy {
  // The sticky container (.pin-showcase__inner) — this is the element that
  // has position:sticky, NOT .pin-showcase__stage.
  private inner: HTMLElement | null = null;
  // The overflow:hidden viewport for the track.
  private stage: HTMLElement | null = null;
  private track: HTMLElement | null = null;
  private items: HTMLElement[] = [];
  private scrollDistance = 0;
  private stickyTop = 96; // Calculated dynamically to center the section
  private ticking = false;
  private rafId: number | null = null;
  private active = false;
  // Re-measures whenever .pin-showcase__inner's actual rendered height
  // changes (fonts swapping in, images loading, etc). A single timed
  // measurement after mount can catch the section mid-layout — e.g. a
  // heading that later wraps differently — which throws off the
  // (viewportHeight - innerH) / 2 centering math for THIS instance only,
  // making one category look off-center relative to the other even
  // though both run the identical formula.
  private resizeObserver: ResizeObserver | null = null;

  private readonly onScroll = () => this.requestTick();
  private readonly onResize = () => this.setup();

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.inner = this.el.nativeElement.querySelector('.pin-showcase__inner');
    this.stage = this.el.nativeElement.querySelector('.pin-showcase__stage');
    this.track = this.el.nativeElement.querySelector('.pin-showcase__track');
    if (!this.inner || !this.stage || !this.track) return;

    this.items = Array.from(this.track.querySelectorAll('.pin-item'));

    // Let images/fonts settle before the first measurement of real widths.
    setTimeout(() => this.setup(), 300);

    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onResize);

      // Belt-and-braces on top of the timeout above: if this section's
      // height changes for any reason after that first measurement
      // (late-loading images, a heading that wraps differently once web
      // fonts swap in, etc), re-run setup() so stickyTop/scrollDistance
      // stay accurate instead of drifting out of sync with the other
      // pinned section on the page.
      if ('ResizeObserver' in window && this.inner) {
        this.resizeObserver = new ResizeObserver(() => this.setup());
        this.resizeObserver.observe(this.inner);
      }
    });
  }

  private setup() {
    if (!this.inner || !this.stage || !this.track) return;

    if (window.innerWidth < 860) {
      this.active = false;
      this.renderer.setStyle(this.el.nativeElement, 'height', 'auto');
      this.renderer.setStyle(this.track, 'transform', 'none');
      this.items.forEach((item) => this.renderer.removeClass(item, 'is-active'));
      return;
    }

    this.active = true;

    // How far the track needs to slide to expose all items.
    this.scrollDistance = Math.max(this.track.scrollWidth - this.stage.clientWidth, 0);

    // Wrapper height = innerHeight + scrollDistance
    // This makes the scroll "budget" for the pin effect exactly equal to
    // scrollDistance — so progress goes 0 → 1 over the full track length.
    // 
    // Why this formula works:
    //   progress = (stickyTop - wrapperRect.top) / scrollDistance
    //   - At the moment .inner starts sticking: wrapperRect.top ≈ stickyTop → progress = 0
    //   - After scrollDistance more pixels: wrapperRect.top = stickyTop - scrollDistance → progress = 1
    //   - At progress = 1: wrapperRect.bottom = (stickyTop - scrollDistance) + (innerH + scrollDistance)
    //                                         = stickyTop + innerH
    //     → CSS sticky releases here (bottom of wrapper = bottom of sticky element) ✓
    const innerH = this.inner.offsetHeight;

    // Calculate perfect vertical center for the sticky element
    // Ensure it doesn't overlap the top nav (96px minimum)
    this.stickyTop = Math.max((window.innerHeight - innerH) / 2, 96);
    this.renderer.setStyle(this.inner, 'top', `${this.stickyTop}px`);

    this.renderer.setStyle(
      this.el.nativeElement,
      'height',
      `${innerH + this.scrollDistance}px`
    );

    this.update();
  }

  private requestTick() {
    if (!this.active || this.ticking) return;
    this.ticking = true;
    this.rafId = requestAnimationFrame(() => {
      this.update();
      this.ticking = false;
    });
  }

  private update() {
    if (!this.active || !this.inner || !this.stage || !this.track || this.scrollDistance <= 0) return;

    const rect = this.el.nativeElement.getBoundingClientRect();

    // progress: 0 when wrapper top is at stickyTop (just started pinning),
    //           1 when the full scrollDistance has been consumed.
    const progress = Math.min(Math.max((this.stickyTop - rect.top) / this.scrollDistance, 0), 1);
    const x = -progress * this.scrollDistance;

    this.renderer.setStyle(this.track, 'transform', `translate3d(${x}px, 0, 0)`);

    // Map progress directly to an item index — item 0 is active at progress 0
    // (before any scrolling) and the last item is active at progress 1.
    // Avoids per-tick getBoundingClientRect and the "starts in the middle" bug
    // that center-distance geometry caused.
    const activeIndex = Math.round(progress * (this.items.length - 1));

    this.items.forEach((item, i) => {
      if (i === activeIndex) {
        this.renderer.addClass(item, 'is-active');
      } else {
        this.renderer.removeClass(item, 'is-active');
      }
    });
  }

  ngOnDestroy() {
    if (typeof window === 'undefined') return;
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
  }
}