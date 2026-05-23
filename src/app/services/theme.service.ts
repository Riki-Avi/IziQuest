import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly theme = signal<'light' | 'dark'>('dark');

  constructor() {
    // Detect system preference or saved preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('iziquest-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.theme.set(savedTheme);
      } else {
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        this.theme.set(prefersLight ? 'light' : 'dark');
      }
    }

    // Apply theme changes to the body
    effect(() => {
      const current = this.theme();
      if (typeof document !== 'undefined') {
        localStorage.setItem('iziquest-theme', current);
        if (current === 'light') {
          document.body.classList.add('light-theme');
        } else {
          document.body.classList.remove('light-theme');
        }
      }
    });
  }

  toggleTheme(): void {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }
}
