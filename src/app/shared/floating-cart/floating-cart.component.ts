import { Component } from '@angular/core';
import { map } from 'rxjs';
import { CartService } from '../../core/cart.service';

@Component({
  selector: 'app-floating-cart',
  templateUrl: './floating-cart.component.html',
  styleUrls: ['./floating-cart.component.scss']
})
export class FloatingCartComponent {
  readonly vm$ = this.cart.lines$.pipe(
    map((lines) => {
      const count = lines.reduce((s, l) => s + l.qty, 0);
      return {
        show: count > 0,
        count,
        subtotal: this.cart.subtotal,
        total: this.cart.total
      };
    })
  );

  constructor(private readonly cart: CartService) {}
}
