import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAVIGATION_IDS, VIEW_IDS } from 'src/constants/data-model';

export default defineNavigationMenuItem({
  universalIdentifier: NAVIGATION_IDS.campaignTouches,
  name: 'Campaign Touches',
  icon: 'IconQrcode',
  position: 12,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: VIEW_IDS.campaignTouches,
});
