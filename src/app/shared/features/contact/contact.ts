import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { Nav } from '../../components/nav/nav';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  imports: [Footer, Nav
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly EMAILJS_SERVICE_ID = 'service_ujf2hmp';
  private readonly EMAILJS_TEMPLATE_ID = 'template_oz8izp6';
  private readonly EMAILJS_PUBLIC_KEY = 'HQxcWu_RAtKK9ZqN5';

  isSending = false;
  sendStatus: 'idle' | 'success' | 'error' = 'idle';

  sendEmail(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    this.isSending = true;
    this.sendStatus = 'idle';

    const timeField = form.querySelector<HTMLInputElement>('input[name="time"]');
    if (timeField) {
      timeField.value = new Date().toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    }

    emailjs
      .sendForm(this.EMAILJS_SERVICE_ID, this.EMAILJS_TEMPLATE_ID, form, this.EMAILJS_PUBLIC_KEY)
      .then(() => {
        this.isSending = false;
        this.sendStatus = 'success';
        form.reset();
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        this.isSending = false;
        this.sendStatus = 'error';
      });
  }
}