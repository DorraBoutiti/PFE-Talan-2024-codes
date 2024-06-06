import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { navbarData } from './nav-data';
import { Router, RouterModule } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { UserService } from '../service/user.service';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

interface SideNavToggle {
  screenWidth : number;
  collapsed: boolean;
}

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
  /*animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({opacity: 0}),
        animate('350ms',
          style({opacity: 1})
        )
      ]),
      transition(':leave', [
        style({opacity: 0}),
        animate('350ms',
          style({opacity: 1})
        )
      ])
    ])
  ]*/
})
export class SideNavComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) {
    this.rule$ = this.userService.getCurrentUser();
    //this.rule = localStorage.getItem('role');
  }

  rule$: Observable<string>;

  @Output() onToggleSideNav : EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  currentUser !: User;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
    }
  }

  /*isActive(routeLink: string): boolean {
    return this.router.isActive(routeLink, true);
  }*/

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((currentUser) => {
      this.screenWidth = window.innerWidth;

      this.currentUser = currentUser;
    }, () => {
      console.error();
      this.router.navigateByUrl('/auth');
    });
  }

  toggleCollapse() : void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav() : void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});

  }
}
