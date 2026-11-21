/**
 * TiltDirective
 * Adds CSS 3D tilt-on-hover to any element.
 * Uses CSS transform perspective for performant 3D look without WebGL.
 */
import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({ selector: '[appTilt]' })
export class TiltDirective {
  @Input() tiltMax = 12; // degrees
  @Input() tiltScale = 1.04;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'transition',
      'transform 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow 400ms ease');
    this.renderer.setStyle(this.el.nativeElement, 'transform-style', 'preserve-3d');
    this.renderer.setStyle(this.el.nativeElement, 'will-change', 'transform');
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    // Skip on touch/mobile
    if (window.matchMedia('(hover: none)').matches) return;

    const rect = this.el.nativeElement.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const mx = e.clientX - cx;
    const my = e.clientY - cy;
    const rx = (my / (rect.height / 2)) * this.tiltMax;
    const ry = -(mx / (rect.width / 2)) * this.tiltMax;

    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(${this.tiltScale},${this.tiltScale},${this.tiltScale})`
    );
    // Dynamic shadow
    const shadowX = -(ry / this.tiltMax) * 12;
    const shadowY = (rx / this.tiltMax) * 12;
    this.renderer.setStyle(
      this.el.nativeElement,
      'box-shadow',
      `${shadowX}px ${shadowY + 8}px 36px rgba(0,0,0,0.18)`
    );
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    );
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '');
  }
}
