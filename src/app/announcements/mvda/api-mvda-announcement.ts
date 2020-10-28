import { MvdaDisclosure } from './mvda-disclosure';

export interface ApiMvdaAnnouncement {
  customAnnouncementId: number;
  mvdaAnnouncementId: number;
  description: string;
  displayStatus: string;
  display: string;
  disclosureDetails: MvdaDisclosure;
}
