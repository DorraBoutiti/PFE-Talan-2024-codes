import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  currentUser !: User;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;
    }, () => {
      console.error();
      this.router.navigateByUrl('/auth');
    });
  }
}
