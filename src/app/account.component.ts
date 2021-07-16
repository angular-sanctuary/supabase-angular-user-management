import { Component, Input, OnInit } from '@angular/core';
import { Profile, SupabaseService } from './supabase.service';
import { Session } from '@supabase/supabase-js';

@Component({
  selector: 'app-account',
  template: `
    <div class="form-widget">
      <app-avatar
        [avatarUrl]="this.profile?.avatar_url"
        (upload)="updateProfile(username.value, website.value, $event)"
      >
      </app-avatar>

      <div>
        <label for="email">Email</label>
        <input id="email" type="text" [value]="session?.user?.email" disabled />
      </div>
      <div>
        <label for="username">Name</label>
        <input #username id="username" type="text" [value]="profile?.username ?? ''" />
      </div>
      <div>
        <label for="website">Website</label>
        <input #website id="website" type="url" [value]="profile?.website ?? ''" />
      </div>

      <div>
        <button
          class="button block primary"
          (click)="updateProfile(username.value, website.value)"
          [disabled]="loading"
        >
          {{ loading ? 'Loading ...' : 'Update' }}
        </button>
      </div>

      <div>
        <button class="button block" (click)="signOut()">Sign Out</button>
      </div>
    </div>
  `,
})
export class AccountComponent implements OnInit {
  loading = false;
  profile: Profile | undefined;

  @Input() session: Session | undefined;

  constructor(private readonly supabase: SupabaseService) {}

  ngOnInit() {
    this.getProfile();
  }

  async getProfile() {
    try {
      this.loading = true;
      let { data: profile, error, status } = await this.supabase.profile;

      if (error && status !== 406) {
        throw error;
      }

      if (profile) {
        this.profile = profile;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      this.loading = false;
    }
  }

  async updateProfile(username: string, website: string, avatar_url: string = '') {
    try {
      this.loading = true;
      await this.supabase.updateProfile({ username, website, avatar_url });
    } catch (error) {
      alert(error.message);
    } finally {
      this.loading = false;
    }
  }

  async signOut() {
    await this.supabase.signOut();
  }
}
