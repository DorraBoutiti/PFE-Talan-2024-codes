import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { User } from '../../models/user.model';
import { Alert } from '../../models/alert.model';
import { BusinessUnit } from '../../models/businessUnit.model';
import { UserService } from '../../service/user.service';
import { AlertService } from '../../service/alert.service';
import { BusinessUnitService } from '../../service/businessUnit.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAlertDialogComponent } from '../../dialog/delete-alert-dialog/delete-alert-dialog.component';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatListModule,
    MatDividerModule,
    DatePipe,
    MatSliderModule
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  alertForm!: FormGroup;
  currentUser!: User;
  alerts: Alert[] = [];
  businessUnitOptions!: string[];
  filteredBusinessUnitOptions!: Observable<string[]>;
  alertOptions: string[] = [];
  filteredAlertOptions!: Observable<string[]>;
  filteredSearchBUOptions!: Observable<string[]>;
  stepperText: string = '';
  listText: string = 'Chargement de la liste des règles..';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  searchByBUControl: FormControl;
  currentSearchValue: string = '';

  constructor(private alertService: AlertService, private _formBuilder: FormBuilder, private userService: UserService, private businessUnitService: BusinessUnitService, private router: Router, private _snackBar: MatSnackBar, public dialog: MatDialog) {
    this.searchByBUControl = this._formBuilder.control('');
  }

  sortAlertsByDateDesc(alerts: Alert[]): Alert[] {
    return alerts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;

      this.businessUnitService.getBusinessUnits().subscribe((bu: BusinessUnit[]) => {
        const uniqueUnits = new Set<string>();
        bu.forEach((element) => {
          uniqueUnits.add(element.businessUnit);
        });
        this.businessUnitOptions = Array.from(uniqueUnits);
        console.log(this.businessUnitOptions);

        this.alertOptions = ["Cas Urgent", "Alerte", "Situation Standard"];
        console.log(this.alertOptions);

        this.getAlerts();

        let businessUnit: string = '';
        if (this.currentUser.role === 'HR_DIRECTOR') {
          businessUnit = '';
        } else if (this.currentUser.role === 'MANAGER') {
          businessUnit = currentUser.businessUnit.businessUnit;
        }

        this.alertForm = this._formBuilder.group({
          user: [this.currentUser],
          businessUnit: [businessUnit, Validators.required],
          alertType: ['', Validators.required],
          pourcentageMin: [0, Validators.required],
          pourcentageMax: [100, Validators.required]
        });

        this.filteredBusinessUnitOptions = this.alertForm.controls['businessUnit'].valueChanges.pipe(
          startWith(''),
          map(value => this._filterBU(value || '')),
        );

        this.filteredAlertOptions = this.alertForm.controls['alertType'].valueChanges.pipe(
          startWith(''),
          map(value => this._filterAlerts(value || '')),
        );

        this.filteredSearchBUOptions = this.searchByBUControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterSearchBU(value || '')),
        );

        this.searchByBUControl.valueChanges.subscribe(value => {
          this.currentSearchValue = value;
          //this.updateAlerts(value); // Update alerts based on the new search value
        });
      });
    }, () => {
      this.router.navigateByUrl('/auth');
    });
  }

  updateAlerts(businessUnit: string) {
    this.alerts = [];
    this.alertService.getAlertsByBusinessUnit(businessUnit).subscribe(
      (alerts: any[]) => {
        this.alerts = alerts;
      },
      (error: any) => {
        console.error('Error fetching alerts:', error);
      }
    );
  }

  onOptionSelected(selectedOption: string) {
    this.alertForm.controls['businessUnit'].setValue(selectedOption);
    //if(this.currentUser.role == 'HR_DIRECTOR' || (this.currentUser.role == 'MANAGER') /*&& (this.currentUser.businessUnit == '')*/) {}
  }

  onInputChange(event: any) {
    const value = event.target?.value;
    if (value) {
      this.onOptionSelected(value);
    }
  }

  onOptionSearchSelected(selectedOption: string) {
    this.updateAlerts(selectedOption);
  }

  onInputSearchChange(event: any) {
    const value = event.target?.value;
    if (value) {
      this.onOptionSelected(value);
    }
  }

  private _filterBU(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.businessUnitOptions.filter((option: string) => option.toLowerCase().includes(filterValue));
  }

  private _filterAlerts(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.alertOptions.filter((option: string) => option.toLowerCase().includes(filterValue));
  }

  private _filterSearchBU(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.businessUnitOptions.filter((option: string) => option.toLowerCase().includes(filterValue));
  }

  onOptionSelectedAlertType(selectedOption: string) {
    this.alertForm.controls['alertType'].setValue(selectedOption);
    //if(this.currentUser.role == 'HR_DIRECTOR' || (this.currentUser.role == 'MANAGER') /*&& (this.currentUser.businessUnit == '')*/) {}
  }

  onInputChangeAlertType(event: any) {
    const value = event.target?.value;
    if (value) {
      this.onOptionSelectedAlertType(value);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000,
      panelClass: ['custom-snackbar']
    });
  }

  openSnackBarSuccess(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000,
      panelClass: ['custom-snackbar-success']
    });
  }

  resetAlertForm() {
    let businessUnit: any = '';
        if (this.currentUser.role === 'HR_DIRECTOR') {
          businessUnit = '';
        } else if (this.currentUser.role === 'MANAGER') {
          businessUnit = this.currentUser.businessUnit?.businessUnit;
        }

    this.alertForm = this._formBuilder.group({
      user: [this.currentUser],
      businessUnit: [businessUnit, Validators.required],
      alertType: ['', Validators.required],
      pourcentageMin: [0, Validators.required],
      pourcentageMax: [100, Validators.required]
    });
  }

  addAlert() {
    if (this.alertForm.valid) {
      const alertType = this.alertForm.value.alertType;
      switch (alertType) {
        case this.alertOptions[0]:
          this.alertForm.controls['alertType'].setValue('EMERGENCY');
          break;
        case this.alertOptions[1]:
          this.alertForm.controls['alertType'].setValue('WARNING');
          break;
        case this.alertOptions[2]:
          this.alertForm.controls['alertType'].setValue('STANDARD');
          break;
        default:
          break;
      }
      this.businessUnitService.getBusinessUnit(this.alertForm.value.businessUnit).subscribe((bu: BusinessUnit) => {
        this.alertForm.controls['businessUnit'].setValue(bu);
        const data = this.alertForm.value;
        this.alertService.addAlert(data).subscribe(() => {
          this.stepperText = 'Vous avez terminé. Alerte créée.';
          this.openSnackBarSuccess("Alerte créée", "Fermer");
          this.getAlerts();
          this.filteredBusinessUnitOptions = this.alertForm.controls['businessUnit'].valueChanges.pipe(
            startWith(''),
            map(value => this._filterBU(value || '')),
          );

          this.filteredAlertOptions = this.alertForm.controls['alertType'].valueChanges.pipe(
            startWith(''),
            map(value => this._filterAlerts(value || '')),
          );
          this.resetAlertForm();
        }, () => {
          this.stepperText = 'Une alerte est déjà créée pour l\'unité organisationnelle sélectionnée.';
          this.openSnackBar("Operation erronée", "Fermer");
        });
      }, () => {
        this.stepperText = 'Une alerte est déjà créée pour l\'unité organisationnelle sélectionnée.';
        this.openSnackBar("Operation erronée", "Fermer");
      });
    } else {
      this.openSnackBar("Operation erronée", "Fermer");
    }
  }

  deleteAlert(alertId: number) {
    this.alertService.deleteAlert(alertId).subscribe((response: any) => {
      console.log(response);
      this.openSnackBarSuccess("Alerte supprimée", "Fermer");
      this.getAlerts();
    }, (error) => {
      this.openSnackBar("Operation erronée", "Fermer");
    });
  }

  getAlerts() {
    this.alertService.getAlerts().subscribe((alerts: Alert[]) => {
      console.log(alerts);
      this.alerts = alerts;
      if(this.alerts.length == 0) {
        this.listText = 'Aucune alerte n\'a été créée';
      }
    }, (error) => {
      this.openSnackBar("Operation erronée", "Fermer");
    });
  }

  formatName(user: User): string {
    if (!this.currentUser) {
      return '';
    }
    const firstName = user.firstName ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase() : '';
    const lastName = user.lastName ? user.lastName.toUpperCase() : '';
    return `${firstName} ${lastName}`;
  }

  getInitials(user: User): string {
    return user.firstName?.charAt(0).toUpperCase() + '' + user.lastName?.charAt(0).toUpperCase();
  }

  openDialog(alertId: number, enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(DeleteAlertDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAlert(alertId);
      }
    });
  }
}
