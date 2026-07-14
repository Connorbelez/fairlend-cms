import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { buildNavigationConfig } from 'src/schema/intake-model';
export default defineNavigationMenuItem({ ...buildNavigationConfig('partner', 4), type: NavigationMenuItemType.VIEW });
