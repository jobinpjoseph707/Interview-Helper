import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog-component',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './confirm-dialog-component.component.html',
  styleUrl: './confirm-dialog-component.component.scss'
})
export class ConfirmDialogComponentComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
