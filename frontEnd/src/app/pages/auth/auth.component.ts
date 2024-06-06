import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EmployeesService } from '../../service/employees.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Observable, map, startWith } from 'rxjs';
import { BusinessUnitService } from '../../service/businessUnit.service';
import { BusinessUnit } from '../../models/businessUnit.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatError,
    MatIcon,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})

export class AuthComponent {
  signUpMode: string = 'container';
  hide = true;
  auth = '';
  action = '';

  roles = ['MANAGER', 'HR_EXPERT'];
  filteredRoles!: Observable<string[]>;

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(public dialog: MatDialog, private _formBuilder: FormBuilder, private router: Router, private authService: AuthService, private userService: UserService, private employeesService: EmployeesService, private businessUnitService: BusinessUnitService, private _snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    this.loginForm = this._formBuilder.group({
      registrationNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this._formBuilder.group({
      registrationNumber: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      description: ['']
    });

    this.filteredRoles = this.registerForm.controls['role'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterRoles(value || '')),
    );
  }

  login_form_messages = {
    'registrationNumber': [
      { type: 'required', message: 'Veuillez renseigner votre matricule.' },
    ],
    'password': [
      { type: 'required', message: 'La saisie de mot de passe est obligatoire.' }
    ],
  };

  register_form_messages = {
    'registrationNumber': [
      { type: 'required', message: 'Veuillez renseigner votre matricule.' },
    ],
    'firstName': [
      { type: 'required', message: 'Veuillez renseigner votre prénom.' },
    ],
    'lastName': [
      { type: 'required', message: 'Veuillez renseigner votre nom.' },
    ],
    'email': [
      { type: 'required', message: 'Veuillez renseigner votre email.' },
      { type: 'email', message: 'Votre email n\'est pas valide.' },
    ],
    'role': [
      { type: 'required', message: 'Veuillez renseigner votre rôle.' }
    ],
    'description': []
  };

  async login() {
    let data = {
      "registrationNumber": this.loginForm.value.registrationNumber,
      "password": this.loginForm.value.password
    };

    if (this.loginForm.valid) {
      console.log(this.loginForm.value);

      this.authService.login(data.registrationNumber, data.password).subscribe((response) => {
        console.log(response);
        localStorage.setItem('token', response.token);
        this.userService.getCurrentUser().subscribe((user) => {
          localStorage.setItem('role', user.role);
        });
        this.router.navigateByUrl('/home');
      });
    } else {
      console.log('error');
      this.auth = "signin";
      this.showErrorSnackBar('Échec de la connexion. Veuillez vérifier vos identifiants', 'Fermer');
    }
  }

  async register() {
    let data: User = {
      "registrationNumber": this.registerForm.value.registrationNumber,
      "firstName": this.registerForm.value.firstName,
      "lastName": this.registerForm.value.lastName,
      "email": this.registerForm.value.email,
      "role": this.registerForm.value.role,
      "description": this.registerForm.value.description,
    };

    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.action = 'register';
      this.authService.registerManager(data).subscribe((response) => {
        console.log(response)
        this.showSuccessSnackBar('Demande envoyé avec succès', 'Fermer');
        this.signUpMode = "container";
      }, () => {
        this.action = '';
        this.showErrorSnackBar('Matricule ou adresse e-mail déjà utilisé(e)', 'Fermer');
      });
    } else {
      console.log('error');
      this.auth = "signup";
    }
    this.action = '';
  }

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

  onRegistrationNumberSelected(selectedOption: string) {
    this.registerForm.controls['registrationNumber'].setValue(selectedOption);
  }

  onRoleSelected(selectedOption: string) {
    this.registerForm.controls['role'].setValue(selectedOption);
  }

  private _filterRoles(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.roles.filter((option: string) => option.toLowerCase().includes(filterValue));
  }

  // Snack bar

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
