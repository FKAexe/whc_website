import { Component, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { ContactForm } from '../../shared/contact-form/contact-form';

@Component({
  selector: 'app-services',
  imports: [ContactForm, TranslatePipe],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle('Our Services | Workhorse Crew London');
    meta.updateTag({ name: 'description', content: 'Full design and build services from Workhorse Crew — architectural design, planning, structural works, fit-out, procurement, and ongoing maintenance across London.' });
    meta.updateTag({ property: 'og:title', content: 'Our Services | Workhorse Crew London' });
    meta.updateTag({ property: 'og:url', content: 'https://workhorsecrew.co.uk/services' });
  }
}
