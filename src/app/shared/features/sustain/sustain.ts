import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { Nav } from '../../components/nav/nav';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-sustain',
  standalone: true,
  imports: [Footer, Nav, RevealDirective],
  templateUrl: './sustain.html',
  styleUrls: ['./sustain.scss'],
})
export class Sustain {

}
