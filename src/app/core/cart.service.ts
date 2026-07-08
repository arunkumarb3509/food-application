import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartLine, Dish } from './models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly linesSubject = new BehaviorSubject<CartLine[]>([]);
  readonly lines$ = this.linesSubject.asObservable();

  constructor() {}

  get lines(): CartLine[] {
    return this.linesSubject.value;
  }

  get itemCount(): number {
    return this.lines.reduce((sum, l) => sum + l.qty, 0);
  }

  get subtotal(): number {
    return this.lines.reduce((sum, l) => sum + l.qty * l.dish.price, 0);
  }

  get deliveryFee(): number {
    return this.subtotal > 499 ? 0 : this.lines.length ? 39 : 0;
  }

  get platformFee(): number {
    return this.lines.length ? 7 : 0;
  }

  get total(): number {
  return this.subtotal + this.deliveryFee + this.platformFee;
  }

  add(dish: Dish, qty = 1) {
    const current = [...this.lines];
    const idx = current.findIndex((l) => l.dish.id === dish.id);
    if (idx >= 0) {
      current[idx] = { ...current[idx], qty: current[idx].qty + qty };
    } else {
      current.push({ dish, qty });
    }
    this.linesSubject.next(current);
  }

  setQty(dishId: string, qty: number) {
    const next = this.lines
      .map((l) => (l.dish.id === dishId ? { ...l, qty } : l))
      .filter((l) => l.qty > 0);
    this.linesSubject.next(next);
  }

  inc(dishId: string) {
    const line = this.lines.find((l) => l.dish.id === dishId);
    if (!line) return;
    this.setQty(dishId, line.qty + 1);
  }

  dec(dishId: string) {
    const line = this.lines.find((l) => l.dish.id === dishId);
    if (!line) return;
    this.setQty(dishId, line.qty - 1);
  }

  remove(dishId: string) {
    this.linesSubject.next(this.lines.filter((l) => l.dish.id !== dishId));
  }

  clear() {
    this.linesSubject.next([]);
  }
}
