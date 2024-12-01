import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
import {DndDirective, SvgIconComponent} from '@tt/common-ui';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [SvgIconComponent, DndDirective],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarUploadComponent {
  avatarUrl = input()
  preview = signal<string | null>('/assets/imgs/avatar-placeholder-big.png');

  avatar: File | null = null;

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];

    this.processFile(file);
  }

  onFileDroped(file: File) {
    this.processFile(file);
  }

  processFile(file: File | null | undefined) {
    if (!file || !file.type.match('image')) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      this.preview.set(event.target?.result?.toString() || '');
    };

    reader.readAsDataURL(file);
    this.avatar = file;
  }

  ngOnInit() {
    this.preview.set('https://icherniakov.ru/yt-course/' + this.avatarUrl())
  }
}
