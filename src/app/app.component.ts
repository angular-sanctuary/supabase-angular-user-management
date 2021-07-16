import { Component, OnInit } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="container" style="padding: 50px 0 100px 0">
      <app-account *ngIf="session; else auth" [session]="session"></app-account>
      <ng-template #auth>
        <app-auth></app-auth>
      </ng-template>
    </div>
  `,
})
export class AppComponent implements OnInit {
  session = this.supabase.session;

  constructor(private readonly supabase: SupabaseService) {}

  ngOnInit() {
    this.supabase.authChanges((_, session) => (this.session = session));
  }
}
