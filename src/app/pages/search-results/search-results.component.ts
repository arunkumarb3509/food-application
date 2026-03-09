import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dish, FoodCategory } from '../../core/models';
import { MockDataService } from '../../core/mock-data.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent {
  q = '';
  category: FoodCategory | 'All' = 'All';
  sort: 'relevance' | 'rating' | 'priceAsc' | 'priceDesc' = 'relevance';

  readonly categories = this.data.categories;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly data: MockDataService
  ) {
    this.route.queryParamMap.subscribe((m) => {
      this.q = m.get('q') ?? '';
    });
  }

  updateQuery() {
    this.router.navigate([], { queryParams: { q: this.q || null }, queryParamsHandling: 'merge' });
  }

  get results(): Dish[] {
    const base = this.data.searchDishes(this.q, this.category);
    const out = [...base];
    if (this.sort === 'rating') out.sort((a, b) => b.rating - a.rating);
    if (this.sort === 'priceAsc') out.sort((a, b) => a.price - b.price);
    if (this.sort === 'priceDesc') out.sort((a, b) => b.price - a.price);
    return out;
  }
}
