import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventDispatchService {
  dispatchEvent(name: string, detail: any, bubbles: boolean = true) {
    const event = new CustomEvent(name, {
      bubbles: bubbles,
      detail: detail,
    });

    dispatchEvent(event);
  }
}
