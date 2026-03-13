import { Component, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  imports: [TranslatePipe],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle('About Us | Workhorse Crew London');
    meta.updateTag({ name: 'description', content: 'Meet the Workhorse Crew team — London-based design and build specialists with 7+ years delivering hospitality fit-outs and residential refurbishments across the UK.' });
    meta.updateTag({ property: 'og:title', content: 'About Us | Workhorse Crew London' });
    meta.updateTag({ property: 'og:url', content: 'https://workhorsecrew.co.uk/about' });
  }
}
