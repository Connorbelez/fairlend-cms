import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { buildNavigationConfig } from 'src/schema/intake-model';
export default defineNavigationMenuItem({ ...buildNavigationConfig('mortgage', 1), type: NavigationMenuItemType.VIEW });
