import { Component } from '@angular/core';
import { MockDataService } from '../../core/mock-data.service';
import { Restaurant } from '../../core/models';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent {
  q = '';
  cuisine = 'All';
  minRating = 0;
  maxDelivery = 60;
  sort: 'relevance' | 'rating' | 'delivery' = 'relevance';

  readonly cuisines: string[] = [
    'All',
    ...Array.from(new Set(this.data.restaurants.flatMap((r) => r.cuisines))).sort()
  ];

  constructor(private readonly data: MockDataService) {}

  get filtered(): Restaurant[] {
    const query = this.q.trim().toLowerCase();
    const filtered = this.data.restaurants.filter((r) => {
      const textOk =
        !query ||
        r.name.toLowerCase().includes(query) ||
        r.cuisines.join(' ').toLowerCase().includes(query);
      const cuisineOk = this.cuisine === 'All' || r.cuisines.includes(this.cuisine);
      const ratingOk = r.rating >= this.minRating;
      const deliveryOk = r.deliveryMins <= this.maxDelivery;
      return textOk && cuisineOk && ratingOk && deliveryOk;
    });

    const sorted = [...filtered];
    if (this.sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    if (this.sort === 'delivery') sorted.sort((a, b) => a.deliveryMins - b.deliveryMins);
    return sorted;
  }
}
