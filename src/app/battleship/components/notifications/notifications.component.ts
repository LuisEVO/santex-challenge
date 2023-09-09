import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, delay, tap } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  @Input({ required: true }) subject!: Subject<string>;

  notifications: string[] = []

  ngOnInit(): void {
      this.subject
        .pipe(
          tap((notification) => this.notifications.unshift(notification)),
        )
        .subscribe()
  }
}
