import { Routes } from '@angular/router';
import { Home } from './shared/features/home/home';
import { About } from './shared/features/about/about';
import { Sustain } from './shared/features/sustain/sustain';
import { Capabilities } from './shared/features/capabilities/capabilities';
import { Innovation } from './shared/features/innovation/innovation';
import { Careers } from './shared/features/careers/careers';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'about', component: About },
  { path: 'about-us', component: About },
  { path: 'sustainability', component: Sustain },
  { path: 'sustain', component: Sustain },
  { path: 'capabilities', component: Capabilities },
  { path: 'innovation', component: Innovation },
  { path: 'careers', component: Careers },
];
