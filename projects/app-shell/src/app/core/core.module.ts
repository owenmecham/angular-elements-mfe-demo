import { AuthModule, AdesaAuthorizationConfig, AuthorizationInterceptor } from '@adesa/authorization';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    AuthModule.forRoot({
      provide: AdesaAuthorizationConfig,
      useFactory: (): AdesaAuthorizationConfig => ({
        ...environment.authorization,
        navigateToLogout: () => this._router.navigate(['/logout']),
      }),
      deps: [Router],
    }),
  ],
  declarations: [CallbackComponent],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true }],
})
export class CoreModule {}
