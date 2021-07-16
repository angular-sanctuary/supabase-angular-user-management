import { Component } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Component({
  selector: 'app-auth',
  template: `
    <div class="row flex flex-center">
      <form class="col-6 form-widget">
        <h1 class="header">Supabase + Angular</h1>
        <p class="description">Sign in via magic link with your email below</p>
        <div>
          <input #input class="inputField" type="email" placeholder="Your email" />
        </div>
        <div>
          <button
            type="submit"
            (click)="handleLogin(input.value)"
            class="button block"
            [disabled]="loading"
          >
            {{ loading ? 'Loading' : 'Send magic link' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class AuthComponent {
  loading = false;

  constructor(private readonly supabase: SupabaseService) {}

  async handleLogin(input: string) {
    try {
      this.loading = true;
      await this.supabase.signIn(input);
      alert('Check your email for the login link!');
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      this.loading = false;
    }
  }
}
