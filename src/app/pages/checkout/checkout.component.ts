import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { CartService } from '../../core/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  readonly form = this.fb.group({
    fullName:    ['', [Validators.required, Validators.minLength(2)]],
    phone:       ['', [Validators.required, Validators.pattern(/^\d{8,15}$/)]],
    addressLine: ['', [Validators.required, Validators.minLength(8)]],
    landmark:    [''],
    payment:     ['UPI', Validators.required]
  });

  readonly vm$ = this.cart.lines$.pipe(
    map((lines) => {
      const subtotal    = lines.reduce((s, l) => s + l.qty * l.dish.price, 0);
      const deliveryFee = subtotal > 499 ? 0 : lines.length ? 39 : 0;
      const platformFee = lines.length ? 7 : 0;
      return { lines, subtotal, deliveryFee, platformFee, total: subtotal + deliveryFee + platformFee };
    })
  );

  placing     = false;
  orderPlaced = false;
  orderRef    = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly cart: CartService
  ) {}

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  async placeOrder() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.cart.lines.length) return;

    this.placing = true;
    // Simulate API call
    await new Promise((r) => setTimeout(r, 900));
    this.orderRef = Math.floor(100000 + Math.random() * 900000).toString();
    this.cart.clear();
    this.placing     = false;
    this.orderPlaced = true;
  }
}
