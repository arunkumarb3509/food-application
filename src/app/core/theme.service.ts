import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'foodapp.theme';
  private readonly modeSubject = new BehaviorSubject<ThemeMode>('light');
  readonly mode$ = this.modeSubject.asObservable();

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  init() {
    const stored = (localStorage.getItem(this.storageKey) as ThemeMode | null) ?? null;
    const preferred: ThemeMode =
      stored ??
      (window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light');
    this.setMode(preferred, false);
  }

  toggle() {
    this.setMode(this.modeSubject.value === 'dark' ? 'light' : 'dark');
  }

  setMode(mode: ThemeMode, persist = true) {
    this.modeSubject.next(mode);
    const body = this.document.body;
    body.classList.toggle('theme-dark', mode === 'dark');
    body.classList.toggle('theme-light', mode === 'light');
    if (persist) localStorage.setItem(this.storageKey, mode);
  }

  get mode(): ThemeMode {
    return this.modeSubject.value;
  }
}
