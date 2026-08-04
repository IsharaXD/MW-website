import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Nav } from '../../components/nav/nav';
import { Footer } from '../../components/footer/footer';
import { COMPANY_STATS } from '../../../data/company-facts';
import { ScrollRevealDirective } from '../../scroll-reveal.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Nav, Footer, RouterLink, ScrollRevealDirective],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly stats = COMPANY_STATS;

  /** Index labels for the right-side section markers */
  readonly sectionIds = ['01', '02', '03', '04'];
}
