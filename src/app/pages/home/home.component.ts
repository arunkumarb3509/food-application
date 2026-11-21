import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { FoodCategory } from '../../core/models';
import { MockDataService } from '../../core/mock-data.service';
import { CinematicHeroService } from '../../core/cinematic-hero.service';
import { ScrollStoryService } from '../../core/scroll-story.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroCanvas') heroCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroSection') heroSection!: ElementRef<HTMLElement>;
  @ViewChild('storySection') storySection!: ElementRef<HTMLElement>;

  webglReady = false;
  q = '';
  activeCategory: FoodCategory | 'All' = 'All';

  readonly categories = this.data.categories;
  readonly trending = this.data.getTrendingRestaurants();
  private readonly allFeatured = this.data.getFeaturedDishes();
  filteredDishes = [...this.allFeatured];

  private revealObserver?: IntersectionObserver;
  private storyObserver?: IntersectionObserver;
  private statObservers: IntersectionObserver[] = [];

  constructor(
    private readonly router: Router,
    private readonly data: MockDataService,
    private readonly cinematicHero: CinematicHeroService,
    private readonly scrollStory: ScrollStoryService,
    private readonly ngZone: NgZone
  ) {}

  async ngAfterViewInit(): Promise<void> {
    // ── 1. Init Three.js hero scene ───────────────────────────────
    if (this.heroCanvas?.nativeElement) {
      this.ngZone.runOutsideAngular(async () => {
        const ok = await this.cinematicHero.init(this.heroCanvas.nativeElement);
        this.ngZone.run(() => { this.webglReady = ok; });
      });
    }

    // ── 2. GSAP scroll reveals (class-based, CSS drives the animation) ──
    this.ngZone.runOutsideAngular(() => {
      this.revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('visible');
              this.revealObserver?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.10 }
      );

      // Observe both .reveal and .gsap-reveal elements
      document.querySelectorAll('.reveal, .gsap-reveal').forEach((el) => {
        this.revealObserver?.observe(el);
      });
    });

    // ── 3. Ingredient story layers: staggered slide-in ────────────
    this.ngZone.runOutsideAngular(() => {
      if (!this.storySection?.nativeElement) return;

      const layers = Array.from(
        this.storySection.nativeElement.querySelectorAll('.story-anim')
      );

      this.storyObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            layers.forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 120);
            });
            // Also trigger individual layer-row items
            const rows = this.storySection.nativeElement.querySelectorAll('.layer-row');
            rows.forEach((row, i) => {
              setTimeout(() => row.classList.add('visible'), 200 + i * 140);
            });
            this.storyObserver?.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      this.storyObserver.observe(this.storySection.nativeElement);
    });

    // ── 4. Stat counters: scroll-triggered number animation ───────
    this.ngZone.runOutsideAngular(() => {
      const statEls = document.querySelectorAll('.stat-num[data-count]');
      statEls.forEach((el) => {
        const rawTarget = el.getAttribute('data-count') ?? '0';
        const target = parseFloat(rawTarget);
        const isFloat = rawTarget.includes('.');

        const obs = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              this.animateCount(el as HTMLElement, target, isFloat);
              obs.disconnect();
            }
          },
          { threshold: 0.5 }
        );
        obs.observe(el);
        this.statObservers.push(obs);
      });
    });
  }

  ngOnDestroy(): void {
    this.cinematicHero.destroy();
    this.scrollStory.destroy();
    this.revealObserver?.disconnect();
    this.storyObserver?.disconnect();
    this.statObservers.forEach((o) => o.disconnect());
  }

  // ── Routing helpers ───────────────────────────────────────────────
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

  // ── Stat counter animation ────────────────────────────────────────
  private animateCount(el: HTMLElement, target: number, isFloat: boolean): void {
    const duration = 1800; // ms
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      el.textContent = isFloat ? current.toFixed(1) : Math.round(current).toString();
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }
}
