import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../service/user.service';
import { ProvideAccessDialogComponent } from '../../dialog/provide-access-dialog/provide-access-dialog.component';
import { RejectRequestDialogComponent } from '../../dialog/reject-access-dialog copy/reject-request-dialog.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-req-list',
    standalone: true,
    templateUrl: './access-request-list.component.html',
    styleUrl: './access-request-list.component.scss',
    imports: [
        CommonModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSortModule,
        MatPaginatorModule,
      ]
})
export class AccessRequestListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<User>;
  pgIndex = 0;

  currentUser!: User;

  displayedColumns: string[] = ['registrationNumber', 'lastName', 'firstName', 'email', 'role', 'businessUnit', 'description', 'action'];
  usersWithoutPassword!: User[];

  loadingEmail!: string;
  action: string = '';

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private userService: UserService, private router: Router, private _snackBar: MatSnackBar, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((currentUser: User) => {
      this.currentUser = currentUser;
      this.getListOfUsersWithoutPassword();
    }, () => {
      console.error();
      this.router.navigateByUrl('/auth');
    });
  }

  ngAfterViewInit() {
    this.getListOfUsersWithoutPassword();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortData(event: any) {
    this.dataSource.sort = this.sort;
  }

  onPaginateChange(event: any) {
    this.dataSource.paginator = this.paginator;
  }

  getListOfUsersWithoutPassword() {
    this.userService.getUsersWithoutPassword().subscribe((users) => {
      this.usersWithoutPassword = users;
      this.dataSource = new MatTableDataSource(this.usersWithoutPassword);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, () => {
      console.error();
    });
  }

  provideAccess(email: string) {
    this.action = "accept";
    this.loadingEmail = email;

    this.userService.getUserByEmail(email).subscribe((user) => {
      this.userService.provideAccessToUser(user.id).subscribe(
        () => {
          this.getListOfUsersWithoutPassword();
          this.action = "";
          this.showSuccessSnackBar("Compte activé", "Fermer");
          this.router.navigateByUrl('/users')
        },
        () => {
          console.error();
          this.showErrorSnackBar("Opération erronée", "Fermer");
        }
      )
    }, () => {
      console.error();
    });
  }

  rejectRequest(email: string) {
    this.action = "reject";
    this.loadingEmail = email;

    this.userService.getUserByEmail(email).subscribe((user) => {
      this.userService.rejectUserRequest(user.id).subscribe(
        () => {
          this.getListOfUsersWithoutPassword();
          this.action = "";
          this.showSuccessSnackBar("Demande refusé", "Fermer");
        },
        () => {
          console.error();
          this.showErrorSnackBar("Operation erronée", "Fermer");
        }
      )
    }, () => {
      console.error();
    });
  }

  // Dialog

  openProvideAccessDialog(email: string, enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(ProvideAccessDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.provideAccess(email);
      }
    });
  }

  openRejectRequestDialog(email: string, enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(RejectRequestDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.rejectRequest(email);
      }
    });
  }

  // Snack Bar

  showSuccessSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000,
      panelClass: ['custom-snackbar-success']
    });
  }

  showErrorSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000,
      panelClass: ['custom-snackbar-error']
    });
  }
}
