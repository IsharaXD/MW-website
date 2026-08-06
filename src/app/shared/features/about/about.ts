import { Component, AfterViewInit, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Footer } from '../../components/footer/footer';
import { Nav } from '../../components/nav/nav';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [Footer, Nav],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements AfterViewInit {

  @ViewChild('timelineTrack') timelineTrack?: ElementRef<HTMLElement>;

  tlAtStart = true;
  tlAtEnd = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private elRef: ElementRef<HTMLElement>
  ) {}

  ngAfterViewInit(): void {
    // Guard against SSR — document only exists in the browser
    if (!isPlatformBrowser(this.platformId)) return;

    // Mark the host as JS-ready: this triggers the reveal CSS transitions
    // Content is visible by default (no opacity:0) until this class is added
    this.elRef.nativeElement.classList.add('js-ready');

    // ── Scroll-reveal ──────────────────────────────────────────
    const revealEls = document.querySelectorAll('[data-reveal]');
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          const delay = +(el.dataset['revealDelay'] ?? 0);
          setTimeout(() => el.classList.add('revealed'), delay);
          revealObs.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(el => revealObs.observe(el));

    // ── About-nav active-section spy ───────────────────────────
    const navItems = document.querySelectorAll<HTMLAnchorElement>('.about-nav__item');
    const sectionIds = ['story', 'vmv', 'leadership', 'timeline', 'gallery'];
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const sectionSpy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navItems.forEach(n => n.classList.remove('active'));
          const match = document.querySelector<HTMLAnchorElement>(
            '.about-nav__item[href="#' + e.target.id + '"]'
          );
          if (match) match.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(s => sectionSpy.observe(s));

    // ── Timeline scroll-nav button state ───────────────────────
    // set initial disabled/enabled state once the track has rendered
    this.onTimelineScroll();
  }

  // ── Timeline scroll-nav ───────────────────────────────────────
  scrollTimeline(direction: 1 | -1): void {
    const el = this.timelineTrack?.nativeElement;
    if (!el) return;

    // scroll by roughly one card's width (300px card + 40px padding)
    const amount = 340 * direction;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  }

  onTimelineKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.scrollTimeline(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.scrollTimeline(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.timelineTrack?.nativeElement.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (event.key === 'End') {
      event.preventDefault();
      const el = this.timelineTrack?.nativeElement;
      if (el) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    }
  }

  onTimelineScroll(): void {
    const el = this.timelineTrack?.nativeElement;
    if (!el) return;

    this.tlAtStart = el.scrollLeft <= 4;
    this.tlAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
  }
}