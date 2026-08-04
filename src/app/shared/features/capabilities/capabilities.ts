import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { Nav } from '../../components/nav/nav';

@Component({
  selector: 'app-capabilities',
  imports: [Footer, Nav],
  templateUrl: './capabilities.html',
  styleUrl: './capabilities.scss',
})
export class Capabilities {

}
