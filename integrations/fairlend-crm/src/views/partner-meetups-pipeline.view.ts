import { defineView } from 'twenty-sdk/define';
import { buildPartnerBoardViewConfig } from 'src/schema/partner-outreach-model';

export default defineView(buildPartnerBoardViewConfig('meetups'));
