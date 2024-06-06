import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './disable-account-dialog.component.html',
  styleUrl: './disable-account-dialog.component.scss'
})
export class DisableAccountDialogComponent {
  constructor(public dialogRef: MatDialogRef<DisableAccountDialogComponent>) {}

  confirm(): void {
    this.dialogRef.close(true);
  }
}
