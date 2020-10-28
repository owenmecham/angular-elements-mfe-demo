import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslationService } from './translation.service';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  private snackbarConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };

  constructor(
    private snackbar: MatSnackBar,
    private zone: NgZone,
    private translationService: TranslationService,
  ) {}

  handleError(error) {
    let message = 'An error occurred.';
    const notSavedMessage = 'Your changes have not been saved.';
    if (error instanceof HttpErrorResponse) {
      message = message + ' ' + ((error.error && error.error.message) || notSavedMessage);
    }

    const translatedMessage = this.translationService.translate(message);

    this.zone.run(() => {
      this.snackbar.open(translatedMessage, null, this.snackbarConfig);
    });

    console.error(translatedMessage, error);
  }
}
