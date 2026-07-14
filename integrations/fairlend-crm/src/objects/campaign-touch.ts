import { defineObject, FieldType, RelationType } from 'twenty-sdk/define';

import {
  CAMPAIGN_TOUCH_FIELD_IDS,
  CAMPAIGN_TOUCH_OBJECT_ID,
  MORTGAGE_LEAD_FIELD_IDS,
  MORTGAGE_LEAD_OBJECT_ID,
} from 'src/constants/data-model';
import { buildCampaignTouchRelationConfig } from 'src/schema/intake-model';

const textField = (universalIdentifier: string, name: string, label: string) => ({
  universalIdentifier,
  type: FieldType.TEXT as const,
  name,
  label,
  isNullable: true as const,
});

export default defineObject({
  universalIdentifier: CAMPAIGN_TOUCH_OBJECT_ID,
  nameSingular: 'campaignTouch',
  namePlural: 'campaignTouches',
  labelSingular: 'Campaign Touch',
  labelPlural: 'Campaign Touches',
  description: 'QR and campaign attribution touchpoints that can be tied to a converted FairLend lead.',
  icon: 'IconQrcode',
  isSearchable: true,
  isUICreatable: false,
  isUIEditable: false,
  labelIdentifierFieldMetadataUniversalIdentifier: CAMPAIGN_TOUCH_FIELD_IDS.name,
  fields: [
    {
      universalIdentifier: CAMPAIGN_TOUCH_FIELD_IDS.name,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Campaign Touch',
      defaultValue: "'Campaign touch'",
      isNullable: false,
    },
    {
      ...textField(CAMPAIGN_TOUCH_FIELD_IDS.scanId, 'scanId', 'Scan ID'),
      isUnique: true,
    },
    textField(CAMPAIGN_TOUCH_FIELD_IDS.campaign, 'campaign', 'Campaign'),
    textField(CAMPAIGN_TOUCH_FIELD_IDS.source, 'source', 'Source'),
    textField(CAMPAIGN_TOUCH_FIELD_IDS.destination, 'destination', 'Destination'),
    textField(CAMPAIGN_TOUCH_FIELD_IDS.referrer, 'referrer', 'Referrer'),
    textField(CAMPAIGN_TOUCH_FIELD_IDS.userAgent, 'userAgent', 'User Agent'),
    textField(CAMPAIGN_TOUCH_FIELD_IDS.hashedIp, 'hashedIp', 'Hashed IP'),
    {
      universalIdentifier: CAMPAIGN_TOUCH_FIELD_IDS.queryParams,
      type: FieldType.RAW_JSON,
      name: 'queryParams',
      label: 'Query Parameters',
      isNullable: true,
    },
    {
      universalIdentifier: CAMPAIGN_TOUCH_FIELD_IDS.capturedAt,
      type: FieldType.DATE_TIME,
      name: 'capturedAt',
      label: 'Captured At',
      isNullable: true,
    },
    {
      universalIdentifier: CAMPAIGN_TOUCH_FIELD_IDS.convertedAt,
      type: FieldType.DATE_TIME,
      name: 'convertedAt',
      label: 'Converted At',
      isNullable: true,
    },
    {
      universalIdentifier: CAMPAIGN_TOUCH_FIELD_IDS.mortgageLead,
      type: FieldType.RELATION,
      name: 'mortgageLead',
      label: 'Mortgage Lead',
      isNullable: true,
      relationTargetObjectMetadataUniversalIdentifier: MORTGAGE_LEAD_OBJECT_ID,
      relationTargetFieldMetadataUniversalIdentifier: MORTGAGE_LEAD_FIELD_IDS.campaignTouches,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        joinColumnName: 'mortgageLeadId',
      },
    },
    buildCampaignTouchRelationConfig('mortgage'),
    buildCampaignTouchRelationConfig('lender'),
    buildCampaignTouchRelationConfig('construction'),
    buildCampaignTouchRelationConfig('partner'),
    buildCampaignTouchRelationConfig('consultation'),
    buildCampaignTouchRelationConfig('general'),
    buildCampaignTouchRelationConfig('newsletter'),
  ],
});
