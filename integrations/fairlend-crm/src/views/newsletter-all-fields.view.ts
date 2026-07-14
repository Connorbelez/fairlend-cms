import { defineView } from 'twenty-sdk/define';
import { buildIntakeViewConfig } from 'src/schema/intake-model';
export default defineView(buildIntakeViewConfig('newsletter', 'all-fields'));
