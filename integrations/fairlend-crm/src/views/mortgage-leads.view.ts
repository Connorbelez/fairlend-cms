import { defineView, ViewKey, ViewSortDirection } from 'twenty-sdk/define';

import { MORTGAGE_LEAD_FIELD_IDS, MORTGAGE_LEAD_OBJECT_ID, VIEW_IDS } from 'src/constants/data-model';

export default defineView({
  universalIdentifier: VIEW_IDS.mortgageLeads,
  name: 'FairLend Mortgage Leads',
  objectUniversalIdentifier: MORTGAGE_LEAD_OBJECT_ID,
  icon: 'IconHomeDollar',
  key: ViewKey.INDEX,
  position: 0,
  fields: [
    { universalIdentifier: 'cf5e2afe-413a-4b6a-84ec-346a920c89d3', fieldMetadataUniversalIdentifier: MORTGAGE_LEAD_FIELD_IDS.name, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '64f986d2-034b-418f-b914-436d56127e56', fieldMetadataUniversalIdentifier: MORTGAGE_LEAD_FIELD_IDS.workflowStatus, position: 1, isVisible: true, size: 180 },
    { universalIdentifier: '1154f3d8-e43a-4182-8032-b713c0621edf', fieldMetadataUniversalIdentifier: MORTGAGE_LEAD_FIELD_IDS.priority, position: 2, isVisible: true, size: 120 },
    { universalIdentifier: 'ba8969fc-d599-4364-bbce-61b895ac33d2', fieldMetadataUniversalIdentifier: MORTGAGE_LEAD_FIELD_IDS.intakeType, position: 3, isVisible: true, size: 180 },
    { universalIdentifier: 'b7869a68-8c4c-440a-bfe2-d8bfc433929c', fieldMetadataUniversalIdentifier: MORTGAGE_LEAD_FIELD_IDS.requestedAmount, position: 4, isVisible: true, size: 160 },
    { universalIdentifier: '91c8ea9e-9bdb-4d6d-89de-037824660136', fieldMetadataUniversalIdentifier: MORTGAGE_LEAD_FIELD_IDS.timeline, position: 5, isVisible: true, size: 160 },
    { universalIdentifier: '098bcb46-d6b2-435d-bdc0-39b779282b6e', fieldMetadataUniversalIdentifier: MORTGAGE_LEAD_FIELD_IDS.contactName, position: 6, isVisible: true, size: 180 },
    { universalIdentifier: 'b572fbab-979d-4ccf-a3ee-3112e76c76fd', fieldMetadataUniversalIdentifier: MORTGAGE_LEAD_FIELD_IDS.email, position: 7, isVisible: true, size: 220 },
    { universalIdentifier: '830f046b-504b-4cd0-8a80-1210cf6d78cc', fieldMetadataUniversalIdentifier: MORTGAGE_LEAD_FIELD_IDS.source, position: 8, isVisible: true, size: 180 },
    { universalIdentifier: '2acf9fa8-8859-4475-92ad-325ce0e723e2', fieldMetadataUniversalIdentifier: MORTGAGE_LEAD_FIELD_IDS.nextActionAt, position: 9, isVisible: true, size: 180 },
  ],
  sorts: [
    {
      universalIdentifier: '892ba58d-5412-4eeb-9842-705a363f7f03',
      fieldMetadataUniversalIdentifier: MORTGAGE_LEAD_FIELD_IDS.nextActionAt,
      direction: ViewSortDirection.ASC,
    },
  ],
});
