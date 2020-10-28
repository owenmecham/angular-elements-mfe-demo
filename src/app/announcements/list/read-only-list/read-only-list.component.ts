import { Component, Input } from '@angular/core';
import { VehicleAnnouncement } from '../../vehicle/vehicle-announcement';
import { InventoryAnnouncement } from '../../inventory/inventory-announcement';
import { CustomAnnouncement } from '../../custom/custom-announcement';
import { MvdaAnnouncement } from '../../mvda/mvda-announcement';

@Component({
  selector: 'adesa-announcements-read-only-list',
  templateUrl: './read-only-list.component.html',
  styleUrls: ['../announcements-list.component.scss', './read-only-list.component.scss'],
})
export class ReadOnlyListComponent {
  @Input() vehicleAnnouncements: VehicleAnnouncement[];
  @Input() inventoryAnnouncements: InventoryAnnouncement[];
  @Input() customAnnouncements: CustomAnnouncement[];
  @Input() mvdaAnnouncements: MvdaAnnouncement[];
}
