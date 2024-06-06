import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'delete-alert-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './delete-alert-dialog.component.html',
  styleUrl: './delete-alert-dialog.component.scss'
})
export class DeleteAlertDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteAlertDialogComponent>) {}

  confirm(): void {
    this.dialogRef.close(true);
  }
}
