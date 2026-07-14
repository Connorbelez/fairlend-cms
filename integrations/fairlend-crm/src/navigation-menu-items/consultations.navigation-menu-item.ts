import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { buildNavigationConfig } from 'src/schema/intake-model';
export default defineNavigationMenuItem({ ...buildNavigationConfig('consultation', 5), type: NavigationMenuItemType.VIEW });
