import { AnnouncementOption } from './announcement-option';

export function filterAvailableAnnouncements(
  activeAnnouncements: { announcementId: number }[],
  availableAnnouncements: AnnouncementOption[],
): AnnouncementOption[] {
  if (!activeAnnouncements || !availableAnnouncements) {
    return;
  }

  const activeAnnouncementIds = activeAnnouncements.map((va) => va.announcementId);

  const filteredList = availableAnnouncements.filter((availableAnnouncement) => {
    return activeAnnouncementIds.indexOf(availableAnnouncement.id) === -1;
  });

  filteredList.sort((a, b) => {
    return a.description.localeCompare(b.description);
  });

  return filteredList;
}
