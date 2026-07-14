import { defineField, FieldType, RelationType, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk/define';

import {
  MORTGAGE_LEAD_FIELD_IDS,
  MORTGAGE_LEAD_OBJECT_ID,
  STANDARD_OBJECT_RELATION_FIELD_IDS,
} from 'src/constants/data-model';

export default defineField({
  universalIdentifier: STANDARD_OBJECT_RELATION_FIELD_IDS.personMortgageLeads,
  type: FieldType.RELATION,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  name: 'fairlendMortgageLeads',
  label: 'FairLend Mortgage Leads',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: MORTGAGE_LEAD_OBJECT_ID,
  relationTargetFieldMetadataUniversalIdentifier: MORTGAGE_LEAD_FIELD_IDS.person,
  universalSettings: { relationType: RelationType.ONE_TO_MANY },
});
