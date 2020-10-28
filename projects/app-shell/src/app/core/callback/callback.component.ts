import { AdesaAuthorizationService } from '@adesa/authorization';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { from, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  template: `
    Callback
  `,
})
export class CallbackComponent implements OnDestroy {
  private _unsubscribe$ = new Subject<void>();

  constructor(private adesaAuthService: AdesaAuthorizationService, private readonly _router: Router) {
    from(this.adesaAuthService.isAuthenticated())
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(
        (isAuthenticated) => {
          if (isAuthenticated) {
            this._router.navigateByUrl(this.adesaAuthService.getDesiredUrl(''));
          } else {
            this.adesaAuthService.completeAuthentication().then(() => this.redirectHome());
          }
        },
        (error) => console.error(error),
      );
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  private redirectHome() {
    this._router.navigate(['/']);
  }
}
