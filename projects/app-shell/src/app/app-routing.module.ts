import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CallbackComponent } from './core/callback/callback.component';
import { LoggedInGuard } from './core/guards/logged-in.guard';
import { ElementComponent } from './element/element.component';

const routes: Routes = [
  {
    path: 'callback',
    component: CallbackComponent,
  },
  { path: 'element', component: ElementComponent, canActivate: [LoggedInGuard] },
  { path: '**', redirectTo: 'element', canActivate: [LoggedInGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
