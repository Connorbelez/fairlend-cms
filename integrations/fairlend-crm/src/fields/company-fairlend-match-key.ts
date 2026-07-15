import { defineField } from 'twenty-sdk/define';
import { buildStandardVerificationFieldConfig } from 'src/schema/partner-contact-model';
export default defineField(buildStandardVerificationFieldConfig('company', 'matchKey'));
