import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { buildNavigationConfig } from 'src/schema/intake-model';
export default defineNavigationMenuItem({ ...buildNavigationConfig('construction', 3), type: NavigationMenuItemType.VIEW });
