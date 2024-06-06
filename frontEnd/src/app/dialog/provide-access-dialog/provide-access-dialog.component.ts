import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './provide-access-dialog.component.html',
  styleUrl: './provide-access-dialog.component.scss'
})
export class ProvideAccessDialogComponent {
  constructor(public dialogRef: MatDialogRef<ProvideAccessDialogComponent>) {}

  confirm(): void {
    this.dialogRef.close(true);
  }
}
