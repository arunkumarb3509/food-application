import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.scss']
})
export class RatingStarsComponent {
  @Input() rating = 0;
  @Input() compact = false;

  stars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  filled(i: number): boolean {
    return this.rating >= i - 0.25;
  }
}
