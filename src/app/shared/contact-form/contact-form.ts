import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
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
}
