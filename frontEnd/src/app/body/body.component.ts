import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../service/user.service';
import { User } from '../models/user.model';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ChatbotComponent],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss'
})
export class BodyComponent {
  @Input() collapsed = false;
  @Input() screenWidth = 0;
  currentUser !: User;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;
    }, () => {
      console.error();
      this.router.navigateByUrl('/auth');
    });
  }

  getBodyClass() : string {
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else if(this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
      styleClass = 'body-md-screen'
    }
    return styleClass;
  }
}
