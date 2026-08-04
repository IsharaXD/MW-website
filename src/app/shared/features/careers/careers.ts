import { Component } from '@angular/core';
import { Nav } from '../../components/nav/nav';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [Footer, Nav],
  templateUrl: './careers.html',
  styleUrls: ['./careers.scss'],
})
export class Careers {

}
