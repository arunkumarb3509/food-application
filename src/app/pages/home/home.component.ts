import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MockDataService } from '../../core/mock-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  q = '';

  readonly categories = this.data.categories;
  readonly trending = this.data.getTrendingRestaurants();
  readonly featured = this.data.getFeaturedDishes();

  constructor(private readonly router: Router, private readonly data: MockDataService) {}

  goSearch() {
    const q = this.q.trim();
    if (!q) return;
    this.router.navigate(['/search'], { queryParams: { q } });
  }
}
