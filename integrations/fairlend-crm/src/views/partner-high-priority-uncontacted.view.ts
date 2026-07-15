import { defineView } from 'twenty-sdk/define';
import { buildPartnerQueueViewConfig } from 'src/schema/partner-outreach-model';

export default defineView(buildPartnerQueueViewConfig('high-priority-uncontacted'));
