import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatMenuModule,
    MatBadgeModule,
    CommonModule,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

  @Input() currentUser!: User;
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  constructor(private router: Router, private notificationService: NotificationService, private userService: UserService) { }

  notificationList: any[] = [];
  unreadNotificationsList: any[] = [];
  eventData: string[] = [];
  notificationCountData!: number;
  showUnread: boolean = true;
  showFirstSeven: boolean = false;
  showAllBtn: boolean = false;

  ngOnInit(): void {
    if (this.currentUser && this.currentUser.id) {
      this.subscribeToEventSource(this.currentUser.id);
      this.getUnreadNotifications();
      this.getFirstSevenNotifications();
      this.getCountUnreadNotifications();
    }

    this.userService.profileUpdated$.subscribe(() => {
      this.refreshCurrentUser();
    });
  }

  refreshCurrentUser() {
    this.userService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;
    }, () => {
      console.error();
      this.router.navigateByUrl('/auth');
    });
  }

  subscribeToEventSource(id: number): void {
    this.notificationService.subscribeToEventSource(id, (event: any) => {
      //console.log("Event :", event);
      //this.eventData.push(event.data);
      this.notificationService.notificationCountData$.subscribe(data => {
        this.notificationCountData = data;
        console.log("Notification Count Data Updated:", this.notificationCountData);
      });
    });
  }

  readNotifications() {
    if (this.currentUser && this.currentUser.id) {
      this.notificationService.changeNotifStatusToRead(this.currentUser.id).subscribe(response => {
        this.notificationCountData = 0;
      })
    }
  }

  formatName(): string {
    if (!this.currentUser) {
      return '';
    }
    const firstName = this.currentUser.firstName ? this.currentUser.firstName.charAt(0).toUpperCase() + this.currentUser.firstName.slice(1).toLowerCase() : '';
    const lastName = this.currentUser.lastName ? this.currentUser.lastName.toUpperCase() : '';
    return `${firstName} ${lastName}`;
  }

  getInitials(): string {
    return this.currentUser.firstName?.charAt(0).toUpperCase() + '' + this.currentUser.lastName?.charAt(0).toUpperCase();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigateByUrl('/auth');
  }

  toRequestAccess () {
    this.router.navigateByUrl('/access-request-list');
  }

  getHeaderClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen'
    }
    return styleClass;
  }

  capitalizeFirstTwoWords(sentence: string): string {
    const words = sentence.split(' ');
    if (words.length >= 2) {
      const firstTwoWords = words.slice(0, 2).map(word => word.charAt(0).toUpperCase() + word.slice(1));
      return firstTwoWords.join(' ') + ' ' + words.slice(2).join(' ');
    }
    return sentence;
  }

  showUnreadNotifications() {
    this.showUnread = true;
    this.showFirstSeven = false;
    this.showAllBtn = false;
    this.getUnreadNotifications();
    this.readNotifications()
  }

  showFirstSevenNotifications() {
    this.showUnread = false;
    this.showFirstSeven = true;
    this.showAllBtn = false;
    this.getFirstSevenNotifications();
  }

  getUnreadNotifications() {
    if (this.currentUser && this.currentUser.id) {
      this.notificationService.getNotificationsByUserIdNotRead(this.currentUser.id).subscribe((response: any) => {
        this.unreadNotificationsList = response;
      })
    }
  }

  getAllNotifications() {
    if (this.currentUser && this.currentUser.id) {
      this.notificationService.getNotificationsByUserId(this.currentUser.id).subscribe((response: any) => {
        this.notificationList = response;
      })
    }
    this.showAllBtn = true;
  }

  getFirstSevenNotifications() {
    if (this.currentUser && this.currentUser.id) {
      this.notificationService.getFirstSevenNotificationsByUserId(this.currentUser.id).subscribe((response: any) => {
        this.notificationList = response.content;
      })
    }
  }

  getCountUnreadNotifications() {
    if (this.currentUser && this.currentUser.id) {
      this.notificationService.countByUserToIdAndReadFalse(this.currentUser.id).subscribe((response: any) => {
        this.notificationCountData = response;
      })
    }
  }
}
