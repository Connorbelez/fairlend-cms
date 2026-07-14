import { defineView, ViewKey, ViewSortDirection } from 'twenty-sdk/define';

import { CONSULTATION_FIELD_IDS, CONSULTATION_OBJECT_ID, VIEW_IDS } from 'src/constants/data-model';

export default defineView({
  universalIdentifier: VIEW_IDS.consultations,
  name: 'FairLend Consultations',
  objectUniversalIdentifier: CONSULTATION_OBJECT_ID,
  icon: 'IconCalendarEvent',
  key: ViewKey.INDEX,
  position: 1,
  fields: [
    { universalIdentifier: 'fc50b9a4-d16b-4bd7-b3f0-f65aa0c901ff', fieldMetadataUniversalIdentifier: CONSULTATION_FIELD_IDS.name, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'd4796a5d-8310-4a90-b8c7-481197a6c930', fieldMetadataUniversalIdentifier: CONSULTATION_FIELD_IDS.status, position: 1, isVisible: true, size: 150 },
    { universalIdentifier: 'e91ef7fd-6462-4f9a-92a9-8a2c4e86a145', fieldMetadataUniversalIdentifier: CONSULTATION_FIELD_IDS.scheduledStart, position: 2, isVisible: true, size: 190 },
    { universalIdentifier: '003455a9-e242-40b3-9ab4-e45b67d6cd6e', fieldMetadataUniversalIdentifier: CONSULTATION_FIELD_IDS.contactName, position: 3, isVisible: true, size: 180 },
    { universalIdentifier: 'f34569fe-776b-4c98-8620-a326007abce1', fieldMetadataUniversalIdentifier: CONSULTATION_FIELD_IDS.email, position: 4, isVisible: true, size: 220 },
    { universalIdentifier: 'ef2a96d7-4caf-4895-b624-7afdb8c81206', fieldMetadataUniversalIdentifier: CONSULTATION_FIELD_IDS.phone, position: 5, isVisible: true, size: 160 },
  ],
  sorts: [
    {
      universalIdentifier: '2b17db83-7606-4e57-928a-2834f07ae1b8',
      fieldMetadataUniversalIdentifier: CONSULTATION_FIELD_IDS.scheduledStart,
      direction: ViewSortDirection.ASC,
    },
  ],
});
