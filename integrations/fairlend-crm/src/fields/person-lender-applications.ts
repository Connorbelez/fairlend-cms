import { defineField } from 'twenty-sdk/define';
import { buildStandardRelationConfig } from 'src/schema/intake-model';
export default defineField(buildStandardRelationConfig('lender', 'person'));
