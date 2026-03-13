import { Component, signal, HostListener, inject, afterNextRender } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { LangSwitcher } from '../lang-switcher/lang-switcher';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, TranslatePipe, LangSwitcher],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  private router = inject(Router);

  isPastHero = signal(false);
  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update(open => !open);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
