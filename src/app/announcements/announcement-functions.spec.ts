import { AnnouncementOption } from './announcement-option';
import { filterAvailableAnnouncements } from './announcements-functions';

describe('filterExistingAnnouncements tests', () => {
  it('should filter out announcement with same id in active and available lists', () => {
    const activeAnnouncements = [{ announcementId: 1 }];
    const availableAnnouncements: AnnouncementOption[] = [
      { id: 1, description: 'description', isBeingAdded: false },
      { id: 2, description: 'description 2', isBeingAdded: false },
    ];

    const result = filterAvailableAnnouncements(activeAnnouncements, availableAnnouncements);

    expect(result[0].id).toBe(2);
  });

  it('should not filter any announcements given no active announcements', () => {
    const activeAnnouncements = [];
    const availableAnnouncements: AnnouncementOption[] = [
      { id: 1, description: 'description', isBeingAdded: false },
      { id: 2, description: 'description 2', isBeingAdded: false },
    ];

    const result = filterAvailableAnnouncements(activeAnnouncements, availableAnnouncements);

    expect(result.length).toBe(2);
  });
});
