import { Component, ElementRef, ViewChild } from '@angular/core';
import { DisableAccountDialogComponent } from '../../dialog/disable-account-dialog copy 2/disable-account-dialog.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { Employee } from '../../models/employee.model';
import { BusinessUnit } from '../../models/businessUnit.model';
import { UserService } from '../../service/user.service';
import { EmployeesService } from '../../service/employees.service';
import { BusinessUnitService } from '../../service/businessUnit.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<User>;
  pgIndex = 0;

  currentUser !: User;

  displayedColumns: string[] = ['registrationNumber', 'lastName', 'firstName', 'email', 'role', 'businessUnit', 'action'];
  activeUsers !: User[];

  loadingEmail !: string;
  action: string = '';

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private router: Router, public dialog: MatDialog, private _snackBar: MatSnackBar, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;
      this.getActiveUsers()
    }, () => {
      console.error();
      this.router.navigateByUrl('/auth');
    });
  }

  ngAfterViewInit() {
    this.getActiveUsers();
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

  getActiveUsers() {
    if (this.currentUser && this.currentUser.id) {
      this.userService.getActiveUsers(this.currentUser.id).subscribe((users) => {
        this.activeUsers = users;
        //console.log(users);

        this.dataSource = new MatTableDataSource(this.activeUsers);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, (error) => {
        console.error();
        this.router.navigateByUrl('/auth');
      });
    }
  }

  disableAccount(email: string) {
    this.action = "disable";
    this.loadingEmail = email;

    this.userService.getUserByEmail(email).subscribe((user) => {
      this.userService.disableAccount(user.id).subscribe(
        () => {
          this.getActiveUsers();
          this.action = "";
          this.showSuccessSnackBar("Compte désactivé", "Fermer");
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

  // Dialog

  openDialog() {
    const dialogRef = this.dialog.open(AddUserDialog, {autoFocus: false});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDiasbleAccountDialog(email: string, enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(DisableAccountDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.disableAccount(email);
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

@Component({
  selector: 'add-user-dialog',
  templateUrl: 'add-user-dialog.html',
  styleUrls: ['add-user-dialog.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    //FormsModule;
    //AsyncPipe,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatError,
    //MatLabel,
    MatInputModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule
  ]
})
export class AddUserDialog {
  registrationNumbers: Set<string> = new Set();
  roles = ['Manager', 'Directeur RH', 'Expert RH'];
  businessUnits: Set<string> = new Set();
  filteredRegistrationNumbers!: Observable<string[]>;
  filteredRoles!: Observable<string[]>;
  filteredBusinessUnits!: Observable<string[]>;

  action: string = '';
  addUserForm!: FormGroup;
  disabledInput = true;

  @ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private _formBuilder: FormBuilder, private _snackBar: MatSnackBar, private userService: UserService, private employeesService: EmployeesService, private businessUnitService: BusinessUnitService) {}

  ngOnInit() {
    this.employeesService.getEmployees().subscribe((employees: Employee[]) => {
      console.log(employees);
      employees.forEach((employee) => {
        this.registrationNumbers.add(employee.registrationNumber);
      });

      this.businessUnitService.getBusinessUnits().subscribe((businessUnits: BusinessUnit[]) => {
        businessUnits.forEach((element) => {
          this.businessUnits.add(element.businessUnit);
        });

        this.sleep(250).then(() => {
          this.addUserForm = this._formBuilder.group({
            registrationNumber: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', Validators.required],
            businessUnit: [{ value: '', disabled: this.disabledInput }, Validators.required]
          });

          this.filteredRegistrationNumbers = this.addUserForm.controls['registrationNumber'].valueChanges.pipe(
            startWith(''),
            map(value => this._filterRegistrationNumbers(value || '')),
          );

          this.filteredRoles = this.addUserForm.controls['role'].valueChanges.pipe(
            startWith(''),
            map(value => this._filterRoles(value || '')),
          );

          this.filteredBusinessUnits = this.addUserForm.controls['businessUnit'].valueChanges.pipe(
            startWith(''),
            map(value => this._filterBusinessUnits(value || '')),
          );
        });
      });
    });
  }

  addUser_form_messages = {
    'registrationNumber': [
      { type: 'required', message: 'Veuillez renseigner un matricule.' },
    ],
    'firstName': [
      { type: 'required', message: 'Veuillez renseigner un prénom.' },
    ],
    'lastName': [
      { type: 'required', message: 'Veuillez renseigner un nom.' },
    ],
    'email': [
      { type: 'required', message: 'Veuillez renseigner un email.' },
      { type: 'email', message: 'Email non valide.' },
    ],
    'role': [
      { type: 'required', message: 'Veuillez renseigner un rôle.' },
    ],
    'businessUnit': [
      { type: 'required', message: 'Veuillez renseigner une unité organisationnelle.' },
    ],
  };

  addUser() {
    if (this.addUserForm.valid) {
      this.action = "add";

      let role = this.addUserForm.value.role;
      switch (role) {
        case this.roles[0]:
          role = 'MANAGER';
          break;
        case this.roles[1]:
          role = 'HR_DIRECTOR';
          break;
        case this.roles[2]:
          role = 'HR_EXPERT';
          break;
        default:
          break;
      }

      this.businessUnitService.getBusinessUnit(this.addUserForm.value.businessUnit).subscribe((businessUnit: any) => {
        if (role != 'MANAGER') {
          businessUnit = null;
        }

        let data = this.addUserForm.value;
        data.role = role;
        data.businessUnit = businessUnit;

        this.userService.addUser(data).subscribe(() => {
          this.showSuccessSnackBar('Utilisateur ajouté', 'Fermer');
          this.action = '';

        }, () => {
          console.error();
          this.showErrorSnackBar('Matricule ou adresse e-mail déjà utilisé(e)', 'Fermer');
          this.action = '';
        });
      }, () => {
        console.error();
      });
    } else {
      this.showErrorSnackBar('Veuillez vérifier vos informations et corriger les champs marqués en rouge.', 'Fermer');
    }
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Auto Complete

  onRegistrationNumberInputChange(event: any) {
    const value = event.target?.value;
    if (value) {
      this.onRegistrationNumberSelected(value);
    }
  }

  onRoleInputChange(event: any) {
    const value = event.target?.value;
    if (value) {
      this.onRoleSelected(value);
    }
  }

  onBusinessUnitInputChange(event: any) {
    const value = event.target?.value;
    if (value) {
      this.onBusinessUnitSelected(value);
    }
  }

  onRegistrationNumberSelected(selectedOption: string) {
    this.addUserForm.controls['registrationNumber'].setValue(selectedOption);
  }

  onRoleSelected(selectedOption: string) {
    this.addUserForm.controls['role'].setValue(selectedOption);

    if (selectedOption != 'Manager') {
      this.disabledInput = true;
      this.addUserForm.controls['businessUnit'].disable();
    } else {
      this.disabledInput = false;
      this.addUserForm.controls['businessUnit'].enable();
    }
  }

  onBusinessUnitSelected(selectedOption: string) {
    this.addUserForm.controls['businessUnit'].setValue(selectedOption);
  }

  private _filterRegistrationNumbers(value: string): string[] {
    const filterValue = value.toLowerCase();
    return Array.from(this.registrationNumbers).filter((option: string) => option.toLowerCase().includes(filterValue));
  }

  private _filterRoles(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.roles.filter((option: string) => option.toLowerCase().includes(filterValue));
  }

  private _filterBusinessUnits(value: string): string[] {
    const filterValue = value.toLowerCase();
    return Array.from(this.businessUnits).filter((option: string) => option.toLowerCase().includes(filterValue));
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
