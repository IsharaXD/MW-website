import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { Nav } from '../../components/nav/nav';

@Component({
  selector: 'app-sustain',
  standalone: true,
  imports: [Footer, Nav],
  templateUrl: './sustain.html',
  styleUrls: ['./sustain.scss'],
})
export class Sustain {

}
