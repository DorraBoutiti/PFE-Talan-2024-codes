import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { User } from '../../../models/user.model';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../../nav-bar/nav-bar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NavBarComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatButtonModule
  ],
  templateUrl: './updateProfile.component.html',
  styleUrl: './updateProfile.component.scss'
})
export class UpdateProfileComponent {
  currentUser!: User;
  hide = true;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;
      this.updateProfileForm = this.formBuilder.group({
        firstName: [currentUser.firstName, Validators.required],
        lastName: [currentUser.lastName, Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    }, (error) => {
      console.error();
      this.router.navigateByUrl('/auth');
    })
  }

  update_profile_form_messages = {
    'firstName': [
      { type: 'required', message: 'Veuillez renseigner votre prénom.' },
    ],
    'lastName': [
      { type: 'required', message: 'Veuillez renseigner votre nom.' },
    ],
    'password': [
      { type: 'required', message: 'La saisie du mot de passe est obligatoire.' },
      { type: 'minlength', message: 'Le mot de passe doit comporter au moins 6 caractères.' }
    ]
  };

  async updateProfile() {
    let data : User = {
      "firstName": this.updateProfileForm.value.firstName,
      "lastName": this.updateProfileForm.value.lastName,
    };

    let updateRequest : any = {
      "user": data,
      "oldPassword": this.updateProfileForm.value.password
    }

    if (this.updateProfileForm.valid) {
      console.log(this.updateProfileForm.value);
      this.userService.updateUser(updateRequest).subscribe((response) => {
        this.openSnackBarSuccess("Profil mis à jour", "Fermer");
        this.userService.emitProfileUpdated();
        console.log("success");
      },
      (error) => {
        console.error();
        this.openSnackBar("Opération erronée", "Fermer");
        this.router.navigateByUrl('/auth');
      })
    } else {
      console.log("not a valid form");
    }
  }

  updateProfileForm!: FormGroup;
  errorMessage: string = '';

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  openSnackBarSuccess(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000,
      panelClass: ['custom-snackbar-success']
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000,
      panelClass: ['custom-snackbar']
    });
  }
}
