import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lang-switcher',
  templateUrl: './lang-switcher.html',
})
export class LangSwitcher implements OnInit {
  private translate = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);

  currentLang = 'en';

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('lang') ?? 'en';
      this.currentLang = saved;
      this.translate.use(saved);
    }
  }

  setLang(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
    }
  }
}
