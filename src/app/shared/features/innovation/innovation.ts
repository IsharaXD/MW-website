import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { Nav } from '../../components/nav/nav';

@Component({
  selector: 'app-innovation',
  standalone: true,
  imports: [Footer, Nav],
  templateUrl: './innovation.html',
  styleUrls: ['./innovation.scss'],
})
export class Innovation {

}
