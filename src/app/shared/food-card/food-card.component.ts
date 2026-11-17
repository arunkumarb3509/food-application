import { Component, Input } from '@angular/core';
import { CartService } from '../../core/cart.service';
import { Dish } from '../../core/models';

@Component({
  selector: 'app-food-card',
  templateUrl: './food-card.component.html',
  styleUrls: ['./food-card.component.scss']
})
export class FoodCardComponent {
  @Input({ required: true }) dish!: Dish;

  justAdded = false;
  private addTimer?: ReturnType<typeof setTimeout>;

  constructor(private readonly cart: CartService) {}

  add() {
    this.cart.add(this.dish, 1);
    this.justAdded = true;
    clearTimeout(this.addTimer);
    this.addTimer = setTimeout(() => {
      this.justAdded = false;
    }, 1500);
  }
}
