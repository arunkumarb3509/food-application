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
      subtotal: lines.reduce((s, l) => s + l.qty * l.dish.price, 0),
      get deliveryFee() {
        const sub = lines.reduce((s, l) => s + l.qty * l.dish.price, 0);
        return sub > 499 ? 0 : lines.length ? 39 : 0;
      },
      platformFee: lines.length ? 7 : 0,
      get total() {
        const sub = lines.reduce((s, l) => s + l.qty * l.dish.price, 0);
        const fee = sub > 499 ? 0 : lines.length ? 39 : 0;
        return sub + fee + (lines.length ? 7 : 0);
      }
    }))
  );

  constructor(private readonly cart: CartService) {}

  inc(id: string) { this.cart.inc(id); }
  dec(id: string) { this.cart.dec(id); }
  remove(id: string) { this.cart.remove(id); }
}
