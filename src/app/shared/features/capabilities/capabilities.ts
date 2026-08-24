import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { Nav } from '../../components/nav/nav';
import { RevealDirective } from '../../directives/reveal.directive';
import { PinnedShowcaseDirective } from '../../directives/pinned-showcase.directive';

@Component({
  selector: 'app-capabilities',
  standalone: true,
  imports: [Footer, Nav, RevealDirective, PinnedShowcaseDirective],
  templateUrl: './capabilities.html',
  styleUrl: './capabilities.scss',
})
export class Capabilities {

}
