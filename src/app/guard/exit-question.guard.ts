import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponentComponent } from '../ui/confirm-dialog-component/confirm-dialog-component.component'; // Adjust the path as necessary
import { map } from 'rxjs/operators';
import { QuestionpageComponent } from '../pages/questionpage/questionpage.component';
@Injectable({
  providedIn: 'root'
})
export class ExitQuestionGuard implements CanDeactivate<QuestionpageComponent> {
  constructor(private dialog: MatDialog) {}

  canDeactivate(
    component: QuestionpageComponent
  ): Observable<boolean> | Promise<boolean> | boolean {
    // If the candidateId is 0, allow navigation without confirmation
    if (component.candidateId === 0) {
      return true;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponentComponent, {
      width: '250px',
      data: { message: 'You have unsaved changes. Are you sure you want to leave?' },
    });

    // Otherwise, show confirmation dialog
    return dialogRef.afterClosed().pipe(
      map(result => {
        return result === true; // Assuming the dialog returns true for confirmation
      })
    );
    }
}
