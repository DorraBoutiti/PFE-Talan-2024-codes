import { Component, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { NotificationService } from '../../service/notification.service';
import { BoxPlotComponent } from '../../box-plot/box-plot.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavBarComponent,
    MatSidenavModule,
    MatButtonModule,
    MatIcon,
    BoxPlotComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  currentUser !: User;

  constructor(private userService: UserService, private notificationService: NotificationService, private router: Router, private el: ElementRef) {
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;
    }, () => {
      console.error();
      this.router.navigateByUrl('/auth');
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToList() {
    this.router.navigate(['/list']);
  }
}
