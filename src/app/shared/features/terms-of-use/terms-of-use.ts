import { Component } from '@angular/core';
import { Nav } from '../../components/nav/nav';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-terms-of-use',
  standalone: true,
  imports: [Footer, Nav],
  templateUrl: './terms-of-use.html',
  styleUrls: ['./terms-of-use.scss'],
})
export class TermsOfUse {}
