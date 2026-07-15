import { defineField } from 'twenty-sdk/define';

import { buildPartnerContactInverseRelationConfig } from 'src/schema/partner-contact-model';

export default defineField(buildPartnerContactInverseRelationConfig('person'));
