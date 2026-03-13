import { Component, inject, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle('Contact Us | Workhorse Crew London');
    meta.updateTag({ name: 'description', content: 'Get in touch with Workhorse Crew for a free consultation. We deliver pub fit-outs, Airbnb renovations and residential refurbishments across London.' });
    meta.updateTag({ property: 'og:title', content: 'Contact Us | Workhorse Crew London' });
    meta.updateTag({ property: 'og:url', content: 'https://workhorsecrew.co.uk/contact' });
  }

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    projectType: ['', Validators.required],
    message: ['', Validators.required],
    honeypot: ['']
  });

  submitted = false;
  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    if (this.form.get('honeypot')?.value) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.http.post('/api/contact', this.form.value).subscribe({
      next: () => {
        this.submitted = true;
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.error ?? 'Something went wrong. Please try again.');
        this.loading.set(false);
      }
    });
  }

  isInvalid(field: string) {
    const ctrl = this.form.get(field);
    return ctrl?.invalid && ctrl?.touched;
  }

  get selectClass() {
    const hasValue = !!this.form.get('projectType')?.value;
    const invalid = this.isInvalid('projectType');
    return [
      'border-b py-3 text-sm outline-none transition-colors duration-200 bg-transparent appearance-none cursor-pointer',
      invalid ? 'border-red-400 text-black' : 'border-neutral-200 focus:border-black',
      !invalid && !hasValue ? 'text-neutral-300' : 'text-black'
    ].join(' ');
  }
}
