import { Component, AfterViewInit, Inject, PLATFORM_ID, ElementRef, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, NgFor, CommonModule } from '@angular/common';
import { Footer } from '../../components/footer/footer';
import { Nav } from '../../components/nav/nav';
import { RevealDirective } from '../../directives/reveal.directive';

interface FactoryLocation {
  key: string;
  name: string;
  images: string[];
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [Footer, Nav, NgFor, CommonModule, RevealDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements AfterViewInit {

  activeMilestone = 0;
  activeImageIndex = 0;

  // Stat counters — displayed values, updated by animateCounters()
  readonly statTargets = [
    { value: 50, suffix: '+' },
    { value: 20, suffix: '+' },
    { value: 95, suffix: '%' },
    { value: 11, suffix: 'M+' },
  ];
  statNums: string[] = this.statTargets.map(s => s.value + s.suffix);

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private elRef: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef
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

    // ── Stat card counter animation ─────────────────────────
    // Use scroll + getBoundingClientRect — reliable, no observer race conditions.
    const statsSection = this.elRef.nativeElement.querySelector<HTMLElement>('.section--stats');
    let countersRan = false;

    const tryRunCounters = () => {
      if (countersRan || !statsSection) return;
      const rect = statsSection.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60 && rect.bottom > 0) {
        countersRan = true;
        window.removeEventListener('scroll', tryRunCounters);
        this.statTargets.forEach((stat, i) => {
          // Reset to 0 before counting up
          this.statNums[i] = '0' + stat.suffix;
          this.cdr.detectChanges();
          setTimeout(() => this.animateStatCounter(i), i * 120);
        });
      }
    };

    window.addEventListener('scroll', tryRunCounters, { passive: true });
    tryRunCounters();
    setTimeout(tryRunCounters, 500);

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

  /** Animate a single stat counter (by index) from 0 → target. */
  private animateStatCounter(index: number): void {
    const { value: target, suffix } = this.statTargets[index];
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = Math.min(now - startTime, duration);
      const progress = 1 - Math.pow(1 - elapsed / duration, 3); // ease-out cubic
      const current = Math.round(target * progress);
      this.statNums[index] = current + suffix;
      this.cdr.detectChanges();
      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        this.statNums[index] = target + suffix;
        this.cdr.detectChanges();
      }
    };
    requestAnimationFrame(tick);
  }

  // Order here also sets the arrow-cycle order and the dot order.
  factories: FactoryLocation[] = [
    {
      key: 'ingiriya',
      name: 'Ingiriya',
      images: [
        'assets/factories/ig-3.png',
        'assets/factories/ig-1.jpeg',
        'assets/factories/ig-2.png'
      ],
    },
    {
      key: 'balangoda',
      name: 'Balangoda',
      images: [
        'assets/factories/bl-1.png',
        'assets/factories/bl-2.png',
        'assets/factories/bl-3.png'
      ],
    },
    {
      key: 'nalanda',
      name: 'Nalanda',
      images: [
        'assets/factories/nl-1.jpg',
        'assets/factories/nl-2.jpg',
        'assets/factories/nl-3.jpg'
      ],
    },
    {
      key: 'pelmadulla',
      name: 'Pelmadulla',
      images: [
         'assets/factories/pm-2.jpeg',
        'assets/factories/pm-3.jpeg',
        'assets/factories/pm-1.jpeg'
       
        
      ],
    },
    {
      key: 'dehiattakandiya',
      name: 'Dehiattakandiya',
      images: [
        'assets/factories/dk-1.jpg',
        'assets/factories/dk-2.png',
        'assets/factories/dk-3.png'
      ],
    },
    {
      key: 'padiyathalawa',
      name: 'Padiyathalawa',
      images:  [
        'assets/factories/Padiyathalawa-2.jpeg',
        'assets/factories/Padiyathalawa -1.jpeg',
        'assets/factories/Padiyathalawa-3.jpeg'

      ],}

  ];

  activeFactory: string = this.factories[0].key;

  get activeFactoryData(): FactoryLocation {
    return this.factories.find(f => f.key === this.activeFactory) ?? this.factories[0];
  }

  setActiveFactory(key: string): void {
    this.activeFactory = key;
    this.activeImageIndex = 0;
  }

  setActiveImage(index: number): void {
    this.activeImageIndex = index;
  }

  nextImage(): void {
    this.activeImageIndex = (this.activeImageIndex + 1) % this.activeFactoryData.images.length;
  }

  prevImage(): void {
    this.activeImageIndex = (this.activeImageIndex - 1 + this.activeFactoryData.images.length) % this.activeFactoryData.images.length;
  }

  nextFactory(): void {
    const i = this.factories.findIndex(f => f.key === this.activeFactory);
    const next = (i + 1) % this.factories.length;
    this.activeFactory = this.factories[next].key;
    this.activeImageIndex = 0;
  }

  prevFactory(): void {
    const i = this.factories.findIndex(f => f.key === this.activeFactory);
    const prev = (i - 1 + this.factories.length) % this.factories.length;
    this.activeFactory = this.factories[prev].key;
    this.activeImageIndex = 0;
  }
}