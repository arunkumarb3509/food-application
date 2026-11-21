/**
 * ScrollStoryService
 * Manages GSAP ScrollTrigger-based scroll-driven animations.
 * Works in Angular 16 without requiring GSAP plugins license.
 */
import { Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollStoryService {
  private gsap: any;
  private ScrollTrigger: any;
  private triggers: any[] = [];
  private isInit = false;

  constructor(private ngZone: NgZone) {}

  async init(): Promise<void> {
    if (this.isInit) return;
    try {
      const gsapModule = await import('gsap');
      const stModule = await import('gsap/ScrollTrigger');
      this.gsap = gsapModule.gsap;
      this.ScrollTrigger = stModule.ScrollTrigger;
      this.gsap.registerPlugin(this.ScrollTrigger);
      this.isInit = true;
    } catch {
      console.warn('[ScrollStory] GSAP not available');
    }
  }

  /**
   * Animate elements into view with a stagger.
   * @param selector CSS selector for target elements
   * @param options Override defaults
   */
  revealGroup(selector: string, options: {
    y?: number; opacity?: number; duration?: number;
    stagger?: number; delay?: number; ease?: string; start?: string;
  } = {}): void {
    if (!this.isInit) return;
    this.ngZone.runOutsideAngular(() => {
      const opts = {
        y: options.y ?? 40,
        opacity: 0,
        duration: options.duration ?? 0.7,
        stagger: options.stagger ?? 0.1,
        delay: options.delay ?? 0,
        ease: options.ease ?? 'power3.out',
      };
      const trigger = this.gsap.from(selector, {
        ...opts,
        scrollTrigger: {
          trigger: selector,
          start: options.start ?? 'top 85%',
          once: true,
        }
      });
      this.triggers.push(trigger);
    });
  }

  /**
   * Parallax movement on scroll within a container.
   */
  parallax(selector: string, yRange: [number, number], scrub = 1.5): void {
    if (!this.isInit) return;
    this.ngZone.runOutsideAngular(() => {
      const el = document.querySelector(selector);
      if (!el) return;
      const trigger = this.gsap.to(selector, {
        y: yRange[1],
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub,
        }
      });
      this.triggers.push(trigger);
    });
  }

  /**
   * Pinned section that plays its timeline while scrolling.
   */
  pinnedTimeline(pinEl: string, cb: (tl: any) => void, scrub = true): void {
    if (!this.isInit) return;
    this.ngZone.runOutsideAngular(() => {
      const tl = this.gsap.timeline({
        scrollTrigger: {
          trigger: pinEl,
          pin: true,
          scrub: scrub === true ? 1 : scrub,
          start: 'top top',
          end: '+=200%',
        }
      });
      cb(tl);
      this.triggers.push(tl);
    });
  }

  refresh(): void {
    this.ScrollTrigger?.refresh?.();
  }

  destroy(): void {
    this.triggers.forEach(t => t?.scrollTrigger?.kill?.() ?? t?.kill?.());
    this.triggers = [];
    this.ScrollTrigger?.getAll?.()?.forEach((t: any) => t.kill());
  }
}
