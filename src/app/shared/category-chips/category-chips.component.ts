import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryChip, FoodCategory } from '../../core/models';

@Component({
  selector: 'app-category-chips',
  templateUrl: './category-chips.component.html',
  styleUrls: ['./category-chips.component.scss']
})
export class CategoryChipsComponent {
  @Input() categories: CategoryChip[] = [];
  @Input() selected?: FoodCategory | 'All';
  @Output() selectedChange = new EventEmitter<FoodCategory | 'All'>();

  select(id: FoodCategory | 'All') {
    this.selectedChange.emit(id);
  }
}
