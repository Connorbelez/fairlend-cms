import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAVIGATION_IDS, VIEW_IDS } from 'src/constants/data-model';

export default defineNavigationMenuItem({
  universalIdentifier: NAVIGATION_IDS.consultations,
  name: 'Consultations',
  icon: 'IconCalendarEvent',
  position: 11,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: VIEW_IDS.consultations,
});
