import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable()
export class AppOverlayContainer extends OverlayContainer {
  _createContainer(): void {
    const container = document.createElement('div');
    container.classList.add('cdk-overlay-container', 'cdk-overlay-container-custom');
    this._document.body.appendChild(container);
    this._containerElement = container;
  }
}
