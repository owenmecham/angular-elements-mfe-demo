import { ComponentAuthorizationService } from '@adesa/authorization';
import { Component } from '@angular/core';

@Component({
  selector: 'shell-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  selectedAuction;

  constructor(componentAuthorization: ComponentAuthorizationService) {
    componentAuthorization.enable();
  }
}
