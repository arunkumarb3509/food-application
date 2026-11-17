import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { CartService } from '../../core/cart.service';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  locations = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'];
  location = this.locations[0];
  search = '';
  mobileOpen = false;
  scrolled = false;

  readonly cartCount$ = this.cart.lines$.pipe(map((lines) => lines.reduce((s, l) => s + l.qty, 0)));

  constructor(
    private readonly router: Router,
    readonly theme: ThemeService,
    private readonly cart: CartService
  ) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 20;
  }

  submitSearch() {
    const q = this.search.trim();
    if (!q) return;
    this.router.navigate(['/search'], { queryParams: { q } });
    this.mobileOpen = false;
  }

  toggleMobile(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobile(): void {
    this.mobileOpen = false;
  }
}
