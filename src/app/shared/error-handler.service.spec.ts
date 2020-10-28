import { HttpErrorResponse } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ErrorHandlerService } from './error-handler.service';
import { TranslationService } from './translation.service';

describe('ErrorHandlerService', () => {
  const snackbarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
  const translationServiceMock = jasmine.createSpyObj('TranslationService', ['translate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        { provide: MatSnackBar, useValue: snackbarMock },
        { provide: TranslationService, useValue: translationServiceMock },
      ],
    });
  });

  it('should be created', inject(
    [ErrorHandlerService, TranslationService],
    (service: ErrorHandlerService) => {
      expect(service).toBeTruthy();
    },
  ));

  describe('handleError tests', () => {
    it('should call snackbar.open with generic error message given unknown error', inject(
      [ErrorHandlerService],
      (service: ErrorHandlerService) => {
        const genericErrorMessage = 'An error occurred.';
        translationServiceMock.translate.withArgs(genericErrorMessage).and.returnValue(genericErrorMessage);

        service.handleError({ some: 'garbage' });

        expect(snackbarMock.open).toHaveBeenCalledWith(genericErrorMessage, null, jasmine.any(Object));
      },
    ));

    it('should call snackbar.open with specific error message given HttpErrorResponse', inject(
      [ErrorHandlerService, TranslationService],
      (service: ErrorHandlerService) => {
        const error: HttpErrorResponse = new HttpErrorResponse({
          error: { message: 'Some useful error message.' },
        });

        const expectedErrorMessage = 'An error occurred. Some useful error message.';
        translationServiceMock.translate.withArgs(expectedErrorMessage).and.returnValue(expectedErrorMessage);

        service.handleError(error);

        expect(snackbarMock.open).toHaveBeenCalledWith(expectedErrorMessage, null, jasmine.any(Object));
      },
    ));

    it('should call snackbar.open with translated error message', inject(
      [ErrorHandlerService, TranslationService],
      (service: ErrorHandlerService) => {
        const translatedError = 'Translated error';
        translationServiceMock.translate.withArgs('An error occurred.').and.returnValue(translatedError);

        service.handleError({ some: 'garbage' });

        expect(snackbarMock.open).toHaveBeenCalledWith(translatedError, null, jasmine.any(Object));
      },
    ));
  });
});
