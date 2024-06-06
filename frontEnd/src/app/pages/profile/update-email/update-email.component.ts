import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { UserService } from '../../../service/user.service';
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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatButtonModule
  ],
  templateUrl: './update-email.component.html',
  styleUrl: './update-email.component.scss'
})
export class UpdateEmailComponent {
  currentUser!: User;
  hidePassword = true;
  updateEmailForm!: FormGroup;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private _formBuilder: FormBuilder, private _snackBar: MatSnackBar, private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;
      this.updateEmailForm = this._formBuilder.group({
        email: [currentUser.email, [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    }, () => {
      console.error();
      this.router.navigateByUrl('/auth');
    })
  }

  update_email_form_messages = {
    'email': [
      { type: 'required', message: 'Veuillez renseigner votre email.' },
      { type: 'email', message: 'Votre email n\'est pas valide.' }
    ],
    'password': [
      { type: 'required', message: 'La saisie du mot de passe est obligatoire.' },
      { type: 'minlength', message: 'Le mot de passe doit comporter au moins 6 caractères.' }
    ]
  };

  async updateEmail() {
    let data : User = {
      "email": this.updateEmailForm.value.email
    };

    let updateRequest : any = {
      "user": data,
      "oldPassword": this.updateEmailForm.value.password
    }

    if (this.updateEmailForm.valid) {
      this.userService.updateUser(updateRequest).subscribe(() => {
        this.showSuccessSnackBar("Profil mis à jour", "Fermer");
        this.userService.emitProfileUpdated();
      },
      () => {
        console.error();
        this.showErrorSnackBar("Opération erronée", "Fermer");
        this.router.navigateByUrl('/auth');
      })
    } else {
      console.log("Formulaire non valide");
    }
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
