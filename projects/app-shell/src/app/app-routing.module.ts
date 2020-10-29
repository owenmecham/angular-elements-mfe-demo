import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElementComponent } from './element/element.component';

const routes: Routes = [
  { path: 'element', component: ElementComponent },
  { path: '**', redirectTo: 'element' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
