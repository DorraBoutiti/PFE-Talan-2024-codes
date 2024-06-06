import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserService } from './service/user.service';
import { User } from './models/user.model';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { BodyComponent } from './body/body.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { FrenchMatPaginatorIntl } from './FrenchMatPaginatorIntl ';
import { AuthGuard } from './service/auth-guard.service';
import { AuthService } from './service/auth.service';
import { AuthComponent } from './pages/auth/auth.component';
import { NgChartsModule } from 'ng2-charts';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';

interface SideNavToggle {
  screenWidth : number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    //BrowserModule,
    //BrowserAnimationsModule,
    RouterOutlet,
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    NavBarComponent,
    SideNavComponent,
    BodyComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatMenuModule,
    MatBadgeModule,
    AuthComponent,
    NgChartsModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: FrenchMatPaginatorIntl },
    AuthGuard,
    { provide: LOCALE_ID, useValue: 'fr-FR'}
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  currentUser !: User;
  isLoginPage: boolean = false;
  isRegisterPage: boolean = false;
  token !: boolean;

  constructor(private userService: UserService, private router: Router, public authService: AuthService, private cd: ChangeDetectorRef) {
    registerLocaleData(fr.default);
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(
      (currentUser) => {
        this.currentUser = currentUser;
        this.authService.authStatusChanged.subscribe(() => {
          this.cd.detectChanges();
        });
      },
      (error) => {
        console.error(error);
        this.router.navigateByUrl('/auth');
      }
    );

    this.authService.authStatusChanged.subscribe(() => {
      this.cd.detectChanges();
    });
  }

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle) : void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
