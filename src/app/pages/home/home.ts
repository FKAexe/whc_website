import { Component, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { ContactForm } from '../../shared/contact-form/contact-form';

@Component({
  selector: 'app-home',
  imports: [ContactForm, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle('Design & Build Specialists in London | Workhorse Crew');
    meta.updateTag({ name: 'description', content: 'Workhorse Crew are London-based design and build specialists for hospitality and residential projects. Pub fit-outs, Airbnb renovations and full refurbishments delivered on time and on budget.' });
    meta.updateTag({ property: 'og:title', content: 'Design & Build Specialists in London | Workhorse Crew' });
    meta.updateTag({ property: 'og:url', content: 'https://workhorsecrew.co.uk/' });
  }
}
