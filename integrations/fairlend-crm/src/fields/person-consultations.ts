import { defineField, FieldType, RelationType, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk/define';

import {
  CONSULTATION_FIELD_IDS,
  CONSULTATION_OBJECT_ID,
  STANDARD_OBJECT_RELATION_FIELD_IDS,
} from 'src/constants/data-model';

export default defineField({
  universalIdentifier: STANDARD_OBJECT_RELATION_FIELD_IDS.personConsultations,
  type: FieldType.RELATION,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  name: 'fairlendConsultations',
  label: 'FairLend Consultations',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: CONSULTATION_OBJECT_ID,
  relationTargetFieldMetadataUniversalIdentifier: CONSULTATION_FIELD_IDS.person,
  universalSettings: { relationType: RelationType.ONE_TO_MANY },
});
