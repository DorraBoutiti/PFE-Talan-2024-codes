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
  selector: 'app-update-password',
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
  templateUrl: './updatePassword.component.html',
  styleUrl: './updatePassword.component.scss'
})
export class UpdatePasswordComponent {
  currentUser!: User;
  hide = [true, true, true];

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;
      this.updatePasswordForm = this.formBuilder.group({
        oldPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6), this.matchValues('newPassword')]]
      });
    }, (error) => {
      console.error();
      this.router.navigateByUrl('/auth');
    })
  }

  matchValues(matchTo: string) {
    return (control: AbstractControl) => {
      return control.parent && control.value === control.parent.get(matchTo)?.value ? null : { notMatch: true };
    }
  }

  update_password_form_messages = {
     'oldPassword': [
      { type: 'required', message: 'La saisie du mot de passe est obligatoire.' },
      { type: 'minlength', message: 'Le mot de passe doit comporter au moins 6 caractères.' }
    ],
    'newPassword': [
      { type: 'required', message: 'La saisie de mot de passe est obligatoire.' },
      { type: 'minlength', message: 'Le mot de passe doit comporter au moins 6 caractères.' }
    ],
    'confirmPassword': [
      { type: 'required', message: 'Veuillez confirmer votre mot de passe.' },
      { type: 'notMatch', message: 'Le mot de passe ne correspond pas.' }
    ]
  };

  async updatePassword() {
    let data : User = {
      "password": this.updatePasswordForm.value.newPassword
    };

    let updateRequest : any = {
      "user": data,
      "oldPassword": this.updatePasswordForm.value.oldPassword
    }

    if (this.updatePasswordForm.valid) {
      console.log(this.updatePasswordForm.value);
      this.userService.updateUserPassword(updateRequest).subscribe((response) => {
        console.log("success");

        this.openSnackBarSuccess("Mot de passe mis à jour", "Fermer");
        this.userService.getCurrentUser().subscribe((currentUser) => {
          this.currentUser = currentUser;
        });
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

  updatePasswordForm!: FormGroup;
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
