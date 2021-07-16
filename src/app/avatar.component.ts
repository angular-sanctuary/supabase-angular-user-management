import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-avatar',
  template: `
    <div>
      <img
        *ngIf="_avatarUrl"
        [src]="_avatarUrl"
        alt="Avatar"
        class="avatar image"
        style="height: 150px; width: 150px"
      />
    </div>
    <div *ngIf="!_avatarUrl" class="avatar no-image" style="height: 150px; width: 150px"></div>
    <div style="width: 150px">
      <label class="button primary block" for="single">
        {{ uploading ? 'Uploading ...' : 'Upload' }}
      </label>
      <input
        style="visibility: hidden;position: absolute"
        type="file"
        id="single"
        accept="image/*"
        (change)="uploadAvatar($event)"
        [disabled]="uploading"
      />
    </div>
  `,
})
export class AvatarComponent {
  _avatarUrl: SafeResourceUrl | undefined;
  uploading = false;

  @Input()
  set avatarUrl(url: string | undefined) {
    if (url) {
      this.downloadImage(url);
    }
  }

  @Output() upload = new EventEmitter<string>();

  constructor(private readonly supabase: SupabaseService, private readonly dom: DomSanitizer) {}

  async downloadImage(path: string) {
    try {
      const { data } = await this.supabase.downLoadImage(path);
      this._avatarUrl = this.dom.bypassSecurityTrustResourceUrl(URL.createObjectURL(data));
    } catch (error) {
      console.error('Error downloading image: ', error.message);
    }
  }

  async uploadAvatar(event: any) {
    try {
      this.uploading = true;
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      await this.supabase.uploadAvatar(filePath, file);
      this.upload.emit(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      this.uploading = false;
    }
  }
}
