import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { CartService } from '../../core/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  readonly form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(8)]],
    addressLine: ['', [Validators.required, Validators.minLength(8)]],
    landmark: [''],
    payment: ['UPI', Validators.required]
  });

  readonly vm$ = this.cart.lines$.pipe(
    map((lines) => ({
      lines,
      subtotal: this.cart.subtotal,
      deliveryFee: this.cart.deliveryFee,
      platformFee: this.cart.platformFee,
      total: this.cart.total
    }))
  );

  placing = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly cart: CartService,
    private readonly router: Router
  ) {}

  async placeOrder() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.cart.lines.length) return;
    this.placing = true;
    await new Promise((r) => setTimeout(r, 700));
    this.cart.clear();
    this.placing = false;
    this.router.navigate(['/']);
  }
}
