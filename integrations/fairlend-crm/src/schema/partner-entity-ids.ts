import { v5 as uuidv5 } from 'uuid';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export const partnerEntityUid = (seed: string): string =>
  uuidv5(seed, APPLICATION_UNIVERSAL_IDENTIFIER);

export const PARTNER_CONTACT_OBJECT_ID = partnerEntityUid('object:partnerContactEvidence');

export const PARTNER_CONTACT_FIELD_IDS = {
  name: partnerEntityUid('field:partnerContactEvidence:name'),
  fairlendContactKey: partnerEntityUid('field:partnerContactEvidence:fairlendContactKey'),
  isPrimary: partnerEntityUid('field:partnerContactEvidence:isPrimary'),
  contactFunction: partnerEntityUid('field:partnerContactEvidence:contactFunction'),
  roleRelevance: partnerEntityUid('field:partnerContactEvidence:roleRelevance'),
  titleAtVerification: partnerEntityUid('field:partnerContactEvidence:titleAtVerification'),
  publicEmail: partnerEntityUid('field:partnerContactEvidence:publicEmail'),
  publicPhone: partnerEntityUid('field:partnerContactEvidence:publicPhone'),
  profileUrl: partnerEntityUid('field:partnerContactEvidence:profileUrl'),
  primaryContactRoute: partnerEntityUid('field:partnerContactEvidence:primaryContactRoute'),
  sourceUrls: partnerEntityUid('field:partnerContactEvidence:sourceUrls'),
  verifiedOn: partnerEntityUid('field:partnerContactEvidence:verifiedOn'),
  confidence: partnerEntityUid('field:partnerContactEvidence:confidence'),
  verificationStatus: partnerEntityUid('field:partnerContactEvidence:verificationStatus'),
  researchNotes: partnerEntityUid('field:partnerContactEvidence:researchNotes'),
  partnerLead: partnerEntityUid('field:partnerContactEvidence:partnerLead'),
  person: partnerEntityUid('field:partnerContactEvidence:person'),
  company: partnerEntityUid('field:partnerContactEvidence:company'),
} as const;

export const PARTNER_LEAD_DECISION_MAKER_LINKS_FIELD_ID =
  partnerEntityUid('field:partnerLead:decisionMakerLinks');
export const PERSON_PARTNER_CONTACT_LINKS_FIELD_ID =
  partnerEntityUid('field:person:fairlendPartnerContactLinks');
export const COMPANY_PARTNER_CONTACT_LINKS_FIELD_ID =
  partnerEntityUid('field:company:fairlendPartnerContactLinks');

export const COMPANY_VERIFICATION_FIELD_IDS = {
  matchKey: partnerEntityUid('field:company:fairlendMatchKey'),
  sourceUrls: partnerEntityUid('field:company:fairlendSourceUrls'),
  verifiedOn: partnerEntityUid('field:company:fairlendVerifiedOn'),
  confidence: partnerEntityUid('field:company:fairlendConfidence'),
  primaryContactRoute: partnerEntityUid('field:company:fairlendPrimaryContactRoute'),
  researchNotes: partnerEntityUid('field:company:fairlendResearchNotes'),
} as const;

export const PERSON_VERIFICATION_FIELD_IDS = {
  identityKey: partnerEntityUid('field:person:fairlendIdentityKey'),
  sourceUrls: partnerEntityUid('field:person:fairlendSourceUrls'),
  verifiedOn: partnerEntityUid('field:person:fairlendVerifiedOn'),
  confidence: partnerEntityUid('field:person:fairlendConfidence'),
  primaryContactRoute: partnerEntityUid('field:person:fairlendPrimaryContactRoute'),
  researchNotes: partnerEntityUid('field:person:fairlendResearchNotes'),
} as const;

export const PARTNER_CONTACT_VIEW_ID = partnerEntityUid('view:partnerContactEvidence:operations');
