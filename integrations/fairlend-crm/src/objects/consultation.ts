import { defineObject } from 'twenty-sdk/define';

import { buildIntakeObjectConfig } from 'src/schema/intake-model';

export default defineObject(buildIntakeObjectConfig('consultation'));
