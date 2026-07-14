import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { buildNavigationConfig } from 'src/schema/intake-model';
export default defineNavigationMenuItem({ ...buildNavigationConfig('lender', 2), type: NavigationMenuItemType.VIEW });
