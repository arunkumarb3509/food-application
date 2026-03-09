import { Component } from '@angular/core';
import { map } from 'rxjs';
import { CartService } from '../../core/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  readonly vm$ = this.cart.lines$.pipe(
    map((lines) => ({
      lines,
      subtotal: this.cart.subtotal,
      deliveryFee: this.cart.deliveryFee,
      platformFee: this.cart.platformFee,
      total: this.cart.total
    }))
  );

  constructor(private readonly cart: CartService) {}

  inc(id: string) {
    this.cart.inc(id);
  }
  dec(id: string) {
    this.cart.dec(id);
  }
  remove(id: string) {
    this.cart.remove(id);
  }
}
