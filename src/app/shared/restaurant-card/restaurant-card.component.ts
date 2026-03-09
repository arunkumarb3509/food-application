import { Component, Input } from '@angular/core';
import { Restaurant } from '../../core/models';

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss']
})
export class RestaurantCardComponent {
  @Input({ required: true }) restaurant!: Restaurant;
}
