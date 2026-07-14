import { defineView, ViewKey, ViewSortDirection } from 'twenty-sdk/define';

import { CAMPAIGN_TOUCH_FIELD_IDS, CAMPAIGN_TOUCH_OBJECT_ID, VIEW_IDS } from 'src/constants/data-model';

export default defineView({
  universalIdentifier: VIEW_IDS.campaignTouches,
  name: 'FairLend Campaign Touches',
  objectUniversalIdentifier: CAMPAIGN_TOUCH_OBJECT_ID,
  icon: 'IconQrcode',
  key: ViewKey.INDEX,
  position: 2,
  fields: [
    { universalIdentifier: 'b5bbbf09-5a61-4664-933d-458fb4476f61', fieldMetadataUniversalIdentifier: CAMPAIGN_TOUCH_FIELD_IDS.name, position: 0, isVisible: true, size: 220 },
    { universalIdentifier: '23f2a6bd-20c8-494c-b7e2-8c8f6b147e45', fieldMetadataUniversalIdentifier: CAMPAIGN_TOUCH_FIELD_IDS.source, position: 1, isVisible: true, size: 160 },
    { universalIdentifier: '978d5936-1b52-4d2b-a2df-a8b241a537ae', fieldMetadataUniversalIdentifier: CAMPAIGN_TOUCH_FIELD_IDS.capturedAt, position: 2, isVisible: true, size: 190 },
    { universalIdentifier: 'ecd5034c-5b99-496b-a16b-bb95d4800aed', fieldMetadataUniversalIdentifier: CAMPAIGN_TOUCH_FIELD_IDS.destination, position: 3, isVisible: true, size: 320 },
  ],
  sorts: [
    {
      universalIdentifier: 'f68be7f7-e282-449a-b134-631a28d4fb69',
      fieldMetadataUniversalIdentifier: CAMPAIGN_TOUCH_FIELD_IDS.capturedAt,
      direction: ViewSortDirection.DESC,
    },
  ],
});
