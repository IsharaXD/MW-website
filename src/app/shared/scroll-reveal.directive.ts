import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input('appScrollReveal') revealDelay: number | string = 0;
  @Input() scrollRevealVariant: 'slide' | 'scale' = 'slide';

  @HostBinding('class.scroll-reveal') readonly revealClass = true;
  @HostBinding('class.scroll-reveal--slide') get isSlideVariant() {
    return this.scrollRevealVariant === 'slide';
  }
  @HostBinding('class.scroll-reveal--scale') get isScaleVariant() {
    return this.scrollRevealVariant === 'scale';
  }
  @HostBinding('class.is-visible') isVisible = false;

  private observer?: IntersectionObserver;
  private readonly reducedMotionQuery =
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      this.isVisible = true;
      return;
    }

    if (this.reducedMotionQuery?.matches) {
      this.isVisible = true;
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const delay = this.getDelayMs();
          this.renderer.setStyle(this.elementRef.nativeElement, '--scroll-reveal-delay', `${delay}ms`);

          window.setTimeout(() => {
            this.isVisible = true;
            this.observer?.disconnect();
          }, delay);
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private getDelayMs(): number {
    const parsed = typeof this.revealDelay === 'number' ? this.revealDelay : Number(this.revealDelay);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
