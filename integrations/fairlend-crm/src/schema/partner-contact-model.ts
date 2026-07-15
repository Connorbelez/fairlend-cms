import {
  defineField,
  defineObject,
  defineView,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewKey,
  ViewSortDirection,
} from 'twenty-sdk/define';

import {
  COMPANY_PARTNER_CONTACT_LINKS_FIELD_ID,
  COMPANY_VERIFICATION_FIELD_IDS,
  PARTNER_CONTACT_FIELD_IDS,
  PARTNER_CONTACT_OBJECT_ID,
  PARTNER_CONTACT_VIEW_ID,
  PARTNER_LEAD_DECISION_MAKER_LINKS_FIELD_ID,
  PERSON_PARTNER_CONTACT_LINKS_FIELD_ID,
  PERSON_VERIFICATION_FIELD_IDS,
  partnerEntityUid,
} from 'src/schema/partner-entity-ids';
import { getIntakeDefinition } from 'src/schema/intake-model';

type ObjectConfig = Parameters<typeof defineObject>[0];
type FieldConfig = Parameters<typeof defineField>[0];
type ViewConfig = Parameters<typeof defineView>[0];

const confidenceOptions = [
  { value: 'HIGH', label: 'High', position: 0, color: 'green' as const },
  { value: 'MEDIUM', label: 'Medium', position: 1, color: 'yellow' as const },
  { value: 'LOW', label: 'Low', position: 2, color: 'red' as const },
];

const textField = (id: string, name: string, label: string, displayedMaxRows?: number) => ({
  universalIdentifier: id,
  type: FieldType.TEXT as const,
  name,
  label,
  isNullable: true as const,
  ...(displayedMaxRows ? { universalSettings: { displayedMaxRows } } : {}),
});

export const buildPartnerContactObjectConfig = (): ObjectConfig => ({
  universalIdentifier: PARTNER_CONTACT_OBJECT_ID,
  nameSingular: 'partnerContactEvidence',
  namePlural: 'partnerContactEvidenceLinks',
  labelSingular: 'Partner Decision-maker',
  labelPlural: 'Partner Decision-makers',
  description: 'Evidence-backed relationship between a Partner Lead and a verified public decision-maker.',
  icon: 'IconUserSearch',
  isSearchable: true,
  isUICreatable: true,
  isUIEditable: true,
  labelIdentifierFieldMetadataUniversalIdentifier: PARTNER_CONTACT_FIELD_IDS.name,
  fields: [
    {
      universalIdentifier: PARTNER_CONTACT_FIELD_IDS.name,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Decision-maker Relationship',
      isNullable: false,
      defaultValue: "'Partner decision-maker'",
    },
    {
      ...textField(PARTNER_CONTACT_FIELD_IDS.fairlendContactKey, 'fairlendContactKey', 'FairLend Contact Key'),
      description: 'Stable UUIDv5 idempotency key for the Partner Lead × Person relationship.',
      isUnique: true,
      isUIEditable: false,
    },
    {
      universalIdentifier: PARTNER_CONTACT_FIELD_IDS.isPrimary,
      type: FieldType.BOOLEAN,
      name: 'isPrimary',
      label: 'Primary Decision-maker',
      isNullable: true,
    },
    {
      universalIdentifier: PARTNER_CONTACT_FIELD_IDS.contactFunction,
      type: FieldType.SELECT,
      name: 'contactFunction',
      label: 'Decision Function',
      isNullable: false,
      defaultValue: "'OTHER'",
      options: [
        { value: 'EXECUTIVE', label: 'Executive Leadership', position: 0, color: 'purple' },
        { value: 'PARTNERSHIPS_BD', label: 'Partnerships / Business Development', position: 1, color: 'blue' },
        { value: 'PROGRAMMING_EDITORIAL', label: 'Programming / Editorial', position: 2, color: 'orange' },
        { value: 'SPONSORSHIP_EVENTS', label: 'Sponsorship / Events', position: 3, color: 'yellow' },
        { value: 'MEMBERSHIP_COMMUNITY', label: 'Membership / Community', position: 4, color: 'green' },
        { value: 'FINANCE', label: 'Finance', position: 5, color: 'crimson' },
        { value: 'OTHER', label: 'Other Relevant Role', position: 6, color: 'gray' },
      ],
    },
    textField(PARTNER_CONTACT_FIELD_IDS.roleRelevance, 'roleRelevance', 'Role Relevance', 6),
    textField(PARTNER_CONTACT_FIELD_IDS.titleAtVerification, 'titleAtVerification', 'Verified Title'),
    textField(PARTNER_CONTACT_FIELD_IDS.publicEmail, 'publicEmail', 'Public Email'),
    textField(PARTNER_CONTACT_FIELD_IDS.publicPhone, 'publicPhone', 'Public Phone'),
    textField(PARTNER_CONTACT_FIELD_IDS.profileUrl, 'profileUrl', 'LinkedIn / Profile URL'),
    textField(PARTNER_CONTACT_FIELD_IDS.primaryContactRoute, 'primaryContactRoute', 'Primary Contact Route', 4),
    textField(PARTNER_CONTACT_FIELD_IDS.sourceUrls, 'sourceUrls', 'Verification Source URLs', 8),
    {
      universalIdentifier: PARTNER_CONTACT_FIELD_IDS.verifiedOn,
      type: FieldType.DATE,
      name: 'verifiedOn',
      label: 'Verified On',
      isNullable: true,
    },
    {
      universalIdentifier: PARTNER_CONTACT_FIELD_IDS.confidence,
      type: FieldType.SELECT,
      name: 'confidence',
      label: 'Verification Confidence',
      isNullable: false,
      defaultValue: "'MEDIUM'",
      options: confidenceOptions,
    },
    {
      universalIdentifier: PARTNER_CONTACT_FIELD_IDS.verificationStatus,
      type: FieldType.SELECT,
      name: 'verificationStatus',
      label: 'Verification Status',
      isNullable: false,
      defaultValue: "'VERIFIED'",
      options: [
        { value: 'VERIFIED', label: 'Verified', position: 0, color: 'green' },
        { value: 'NEEDS_REVERIFY', label: 'Needs Re-verification', position: 1, color: 'yellow' },
        { value: 'UNAVAILABLE', label: 'Public Details Unavailable', position: 2, color: 'gray' },
      ],
    },
    textField(PARTNER_CONTACT_FIELD_IDS.researchNotes, 'researchNotes', 'Research Notes', 10),
    {
      universalIdentifier: PARTNER_CONTACT_FIELD_IDS.partnerLead,
      type: FieldType.RELATION,
      name: 'partnerLead',
      label: 'Partner Lead',
      isNullable: true,
      relationTargetObjectMetadataUniversalIdentifier: getIntakeDefinition('partner').objectId,
      relationTargetFieldMetadataUniversalIdentifier: PARTNER_LEAD_DECISION_MAKER_LINKS_FIELD_ID,
      universalSettings: { relationType: RelationType.MANY_TO_ONE, joinColumnName: 'partnerLeadId' },
    },
    {
      universalIdentifier: PARTNER_CONTACT_FIELD_IDS.person,
      type: FieldType.RELATION,
      name: 'person',
      label: 'Person',
      isNullable: true,
      relationTargetObjectMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier: PERSON_PARTNER_CONTACT_LINKS_FIELD_ID,
      universalSettings: { relationType: RelationType.MANY_TO_ONE, joinColumnName: 'personId' },
    },
    {
      universalIdentifier: PARTNER_CONTACT_FIELD_IDS.company,
      type: FieldType.RELATION,
      name: 'company',
      label: 'Company',
      isNullable: true,
      relationTargetObjectMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier: COMPANY_PARTNER_CONTACT_LINKS_FIELD_ID,
      universalSettings: { relationType: RelationType.MANY_TO_ONE, joinColumnName: 'companyId' },
    },
  ],
});

export const buildPartnerContactInverseRelationConfig = (
  standardObject: 'person' | 'company',
): FieldConfig => ({
  universalIdentifier: standardObject === 'person'
    ? PERSON_PARTNER_CONTACT_LINKS_FIELD_ID
    : COMPANY_PARTNER_CONTACT_LINKS_FIELD_ID,
  type: FieldType.RELATION,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS[standardObject].universalIdentifier,
  name: 'fairlendPartnerContactLinks',
  label: 'FairLend Partner Decision-maker Links',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: PARTNER_CONTACT_OBJECT_ID,
  relationTargetFieldMetadataUniversalIdentifier: standardObject === 'person'
    ? PARTNER_CONTACT_FIELD_IDS.person
    : PARTNER_CONTACT_FIELD_IDS.company,
  universalSettings: { relationType: RelationType.ONE_TO_MANY },
}) as FieldConfig;

type StandardVerificationField =
  | 'matchKey' | 'identityKey' | 'sourceUrls' | 'verifiedOn'
  | 'confidence' | 'primaryContactRoute' | 'researchNotes';

export const buildStandardVerificationFieldConfig = (
  standardObject: 'person' | 'company',
  field: StandardVerificationField,
): FieldConfig => {
  const ids = standardObject === 'person' ? PERSON_VERIFICATION_FIELD_IDS : COMPANY_VERIFICATION_FIELD_IDS;
  const id = ids[field as keyof typeof ids];
  if (!id) throw new Error(`${field} is not valid for ${standardObject}.`);
  const common = {
    universalIdentifier: id,
    objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS[standardObject].universalIdentifier,
    isNullable: true,
  };
  if (field === 'verifiedOn') return { ...common, type: FieldType.DATE, name: 'fairlendVerifiedOn', label: 'FairLend Verified On' } as FieldConfig;
  if (field === 'confidence') {
    return {
      ...common,
      type: FieldType.SELECT,
      name: 'fairlendConfidence',
      label: 'FairLend Verification Confidence',
      defaultValue: "'MEDIUM'",
      options: confidenceOptions,
    } as FieldConfig;
  }
  const name = field === 'matchKey' ? 'fairlendMatchKey'
    : field === 'identityKey' ? 'fairlendIdentityKey'
      : `fairlend${field[0].toUpperCase()}${field.slice(1)}`;
  const label = field === 'matchKey' ? 'FairLend Company Match Key'
    : field === 'identityKey' ? 'FairLend Person Identity Key'
      : field === 'sourceUrls' ? 'FairLend Verification Sources'
        : field === 'primaryContactRoute' ? 'FairLend Primary Contact Route'
          : 'FairLend Research Notes';
  return {
    ...common,
    type: FieldType.TEXT,
    name,
    label,
    ...(field === 'matchKey' || field === 'identityKey' ? { isUnique: true, isUIEditable: false } : {}),
    ...(field === 'sourceUrls' || field === 'researchNotes' ? { universalSettings: { displayedMaxRows: field === 'sourceUrls' ? 8 : 10 } } : {}),
  } as FieldConfig;
};

export const buildPartnerContactViewConfig = (): ViewConfig => ({
  universalIdentifier: PARTNER_CONTACT_VIEW_ID,
  name: 'Partner Decision-makers — Verification Evidence',
  objectUniversalIdentifier: PARTNER_CONTACT_OBJECT_ID,
  icon: 'IconUserSearch',
  key: ViewKey.INDEX,
  position: 0,
  fields: [
    'name', 'isPrimary', 'contactFunction', 'confidence', 'verificationStatus',
    'person', 'company', 'partnerLead', 'titleAtVerification', 'publicEmail',
    'publicPhone', 'profileUrl', 'verifiedOn', 'primaryContactRoute',
  ].map((fieldName, position) => ({
    universalIdentifier: partnerEntityUid(`view-field:partnerContactEvidence:operations:${fieldName}`),
    fieldMetadataUniversalIdentifier: PARTNER_CONTACT_FIELD_IDS[fieldName as keyof typeof PARTNER_CONTACT_FIELD_IDS],
    position,
    isVisible: true,
    size: fieldName === 'name' ? 260 : fieldName === 'primaryContactRoute' ? 260 : 170,
  })),
  sorts: [
    {
      universalIdentifier: partnerEntityUid('view-sort:partnerContactEvidence:operations:isPrimary'),
      fieldMetadataUniversalIdentifier: PARTNER_CONTACT_FIELD_IDS.isPrimary,
      direction: ViewSortDirection.DESC,
    },
    {
      universalIdentifier: partnerEntityUid('view-sort:partnerContactEvidence:operations:confidence'),
      fieldMetadataUniversalIdentifier: PARTNER_CONTACT_FIELD_IDS.confidence,
      direction: ViewSortDirection.ASC,
    },
  ],
}) as ViewConfig;
