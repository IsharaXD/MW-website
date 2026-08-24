import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { Nav } from '../../components/nav/nav';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [Footer, Nav, RevealDirective],
  templateUrl: './careers.html',
  styleUrls: ['./careers.scss'],
})
export class Careers {

}
