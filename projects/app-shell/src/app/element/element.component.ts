import { AfterViewInit, Component } from '@angular/core';
import { AnnouncementEvent } from './announcement-event';

@Component({
  selector: 'shell-element',
  templateUrl: './element.component.html',
})
export class ElementComponent implements AfterViewInit {
  inventoryId: string;
  auctionSiteId: string;
  externalContextToken: string;
  themeName = 'portal';
  hasEditPermission = true;
  announcementsElement: any;
  announcementsViewElement: any;
  dispatchedEvents: AnnouncementEvent[] = [];
  editView = false;
  localeName = 'en-us';

  constructor() {
    this.loadScript();
    this.auctionSiteId = localStorage.getItem('auctionSiteId');
  }

  ngAfterViewInit() {
    this.getViews();

    if (this.auctionSiteId) {
      this.updateAuctionSiteId();
    }

    if (this.localeName) {
      this.updateLocale(this.localeName);
    }

    if (this.hasEditPermission) {
      this.updateEditPermission();
    }

    this.registerEventListeners();
  }

  private getViews() {
    this.announcementsElement = document.getElementsByTagName('mrclean-magic')[0];
    this.announcementsViewElement = document.getElementsByTagName('mrclean-magic-view')[0];
  }

  registerEventListeners() {
    addEventListener('inventoryAnnouncementsUpdated', (event: CustomEvent) => this.logEvent(event));
    addEventListener('inventoryAnnouncementAdded', (event: CustomEvent) => this.logEvent(event));
    addEventListener('inventoryAnnouncementDeleted', (event: CustomEvent) => this.logEvent(event));
    addEventListener('mvdaAnnouncementsUpdated', (event: CustomEvent) => this.logEvent(event));
    addEventListener('mvdaAnnouncementDeleted', (event: CustomEvent) => this.logEvent(event));
    addEventListener('mvdaAnnouncementAdded', (event: CustomEvent) => this.logEvent(event));
    addEventListener('vehicleAnnouncementsUpdated', (event: CustomEvent) => this.logEvent(event));
    addEventListener('vehicleAnnouncementAdded', (event: CustomEvent) => this.logEvent(event));
    addEventListener('vehicleAnnouncementDeleted', (event: CustomEvent) => this.logEvent(event));
    addEventListener('customAnnouncementsUpdated', (event: CustomEvent) => this.logEvent(event));
    addEventListener('customAnnouncementAdded', (event: CustomEvent) => this.logEvent(event));
    addEventListener('customAnnouncementDeleted', (event: CustomEvent) => this.logEvent(event));
    addEventListener('editModeToggleUpdated', (event: CustomEvent) => this.updateEditMode(event));
  }

  updateEditMode(event: CustomEvent) {
    this.editView = event.detail;
    this.logEvent(event);
  }

  logEvent(event: CustomEvent) {
    const announcementEvent: AnnouncementEvent = {
      time: new Date(),
      event: event,
    };

    console.log(`Event: ${event.type}`, announcementEvent);

    this.dispatchedEvents.push(announcementEvent);
  }

  updateTheme(val: string) {
    this.getViews();
    this.announcementsElement.setAttribute('site-theme-name', val);
  }

  updateToken() {
    this.getViews();
    if (this.announcementsViewElement) {
      this.announcementsViewElement.setAttribute('external-context-token', this.externalContextToken);
    }
    if (this.announcementsElement) {
      this.announcementsElement.setAttribute('external-context-token', this.externalContextToken);
    }
  }

  updateLocale(val: string) {
    this.getViews();
    if (this.announcementsViewElement) {
      this.announcementsViewElement.setAttribute('mrclean-locale', val);
    }
    if (this.announcementsElement) {
      this.announcementsElement.setAttribute('mrclean-locale', val);
    }
  }

  updateInventoryId() {
    this.getViews();
    if (this.announcementsElement) {
      this.announcementsElement.setAttribute('inventory-id', this.inventoryId);
    }
    if (this.announcementsViewElement) {
      this.announcementsViewElement.setAttribute('inventory-id', this.inventoryId);
    }
  }

  updateAuctionSiteId() {
    this.getViews();
    if (this.announcementsElement) {
      this.announcementsElement.setAttribute('auction-site-id', this.auctionSiteId);
    }
    if (this.announcementsViewElement) {
      this.announcementsViewElement.setAttribute('auction-site-id', this.auctionSiteId);
    }
    localStorage.setItem('auctionSiteId', this.auctionSiteId);
  }

  updateEditPermission() {
    this.getViews();
    if (this.announcementsElement) {
      this.announcementsElement.setAttribute('has-edit-permission', this.hasEditPermission);
    }
    if (this.announcementsViewElement) {
      this.announcementsViewElement.setAttribute('has-edit-permission', this.hasEditPermission);
      localStorage.setItem('hasEditPermission', `${this.hasEditPermission}`);
    }
  }

  clearEvents() {
    this.dispatchedEvents = [];
  }

  loadScript() {
    const scriptName = 'mrclean-magic';

    let isFound = false;
    const scripts = document.getElementsByTagName('script');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes('scriptName')) {
        isFound = true;
      }
    }

    if (!isFound) {
      const script = this.createScriptNode(scriptName);
      this.addNodeToHead(script);
    }
  }

  private createScriptNode(scriptName: string): HTMLScriptElement {
    const node = document.createElement('script');
    node.src = `elements/${scriptName}.js`;
    node.type = 'text/javascript';
    node.async = false;

    return node;
  }

  private addNodeToHead(node: HTMLElement) {
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  toggleView() {
    this.editView = !this.editView;
  }
}
