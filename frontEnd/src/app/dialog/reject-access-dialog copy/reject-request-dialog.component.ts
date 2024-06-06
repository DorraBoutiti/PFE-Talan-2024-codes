import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './reject-request-dialog.component.html',
  styleUrl: './reject-request-dialog.component.scss'
})
export class RejectRequestDialogComponent {
  constructor(public dialogRef: MatDialogRef<RejectRequestDialogComponent>) {}

  confirm(): void {
    this.dialogRef.close(true);
  }
}
