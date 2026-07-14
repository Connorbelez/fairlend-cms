import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAVIGATION_IDS, VIEW_IDS } from 'src/constants/data-model';

export default defineNavigationMenuItem({
  universalIdentifier: NAVIGATION_IDS.mortgageLeads,
  name: 'Mortgage Leads',
  icon: 'IconHomeDollar',
  position: 10,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: VIEW_IDS.mortgageLeads,
});
