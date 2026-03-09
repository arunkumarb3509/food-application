import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dish, FoodCategory, Restaurant } from '../../core/models';
import { MockDataService } from '../../core/mock-data.service';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.scss']
})
export class RestaurantDetailsComponent {
  restaurant?: Restaurant;
  menu: Dish[] = [];
  categories: (FoodCategory | 'All')[] = ['All'];
  selected: FoodCategory | 'All' = 'All';

  constructor(private readonly route: ActivatedRoute, private readonly data: MockDataService) {
    const id = this.route.snapshot.paramMap.get('id');
    this.restaurant = this.data.getRestaurant(id);
    this.menu = this.data.getMenuForRestaurant(id);
    const cats = Array.from(new Set(this.menu.map((m) => m.category))) as FoodCategory[];
    this.categories = ['All', ...cats];
  }

  get visibleMenu(): Dish[] {
    if (this.selected === 'All') return this.menu;
    return this.menu.filter((m) => m.category === this.selected);
  }
}
