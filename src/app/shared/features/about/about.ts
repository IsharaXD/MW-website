import { Component, AfterViewInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
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

  activeMilestone = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private elRef: ElementRef<HTMLElement>
  ) { }

  setMilestone(index: number) {
    this.activeMilestone = index;
  }

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
  }
}