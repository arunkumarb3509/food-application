import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FoodCategory } from '../../core/models';
import { MockDataService } from '../../core/mock-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  q = '';
  activeCategory: FoodCategory | 'All' = 'All';

  readonly categories = this.data.categories;
  readonly trending = this.data.getTrendingRestaurants();
  private readonly allFeatured = this.data.getFeaturedDishes();
  filteredDishes = [...this.allFeatured];

  private observer?: IntersectionObserver;

  constructor(private readonly router: Router, private readonly data: MockDataService) {}

  ngAfterViewInit(): void {
    // Setup scroll-reveal IntersectionObserver
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            this.observer?.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      this.observer?.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  goSearch(): void {
    const q = this.q.trim();
    if (!q) return;
    this.router.navigate(['/search'], { queryParams: { q } });
  }

  goCategory(cat: FoodCategory): void {
    this.router.navigate(['/search'], { queryParams: { q: cat } });
  }

  onCategoryChange(cat: FoodCategory | 'All'): void {
    this.activeCategory = cat;
    if (cat === 'All') {
      this.filteredDishes = [...this.allFeatured];
    } else {
      const all = this.data.dishes.filter((d) => d.category === cat).slice(0, 6);
      this.filteredDishes = all.length > 0 ? all : [...this.allFeatured];
    }
  }
}
