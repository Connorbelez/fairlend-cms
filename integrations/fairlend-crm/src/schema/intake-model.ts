import {
  defineField,
  defineObject,
  defineView,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewKey,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { v5 as uuidv5 } from 'uuid';

import {
  CAMPAIGN_TOUCH_FIELD_IDS,
  CAMPAIGN_TOUCH_OBJECT_ID,
  CONSULTATION_FIELD_IDS,
  CONSULTATION_OBJECT_ID,
  MORTGAGE_LEAD_FIELD_IDS,
  MORTGAGE_LEAD_OBJECT_ID,
  NAVIGATION_IDS,
  STANDARD_OBJECT_RELATION_FIELD_IDS,
  VIEW_IDS,
} from 'src/constants/data-model';
import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import {
  PARTNER_CONTACT_FIELD_IDS,
  PARTNER_CONTACT_OBJECT_ID,
} from 'src/schema/partner-entity-ids';

export type IntakeObjectKind =
  | 'mortgage'
  | 'lender'
  | 'construction'
  | 'partner'
  | 'consultation'
  | 'general'
  | 'newsletter';

export type IntakeViewKind = 'operations' | 'all-fields' | 'drafts' | 'workflow';

type ObjectConfig = Parameters<typeof defineObject>[0];
type ObjectField = NonNullable<ObjectConfig['fields']>[number];
type FieldConfig = Parameters<typeof defineField>[0];
type ViewConfig = Parameters<typeof defineView>[0];
type SelectColor = 'blue' | 'crimson' | 'gray' | 'green' | 'orange' | 'purple' | 'red' | 'yellow';

type IntakeDefinition = {
  kind: IntakeObjectKind;
  objectId: string;
  nameSingular: string;
  namePlural: string;
  labelSingular: string;
  labelPlural: string;
  description: string;
  icon: string;
  workflowFieldName: string;
  workflowOptions: readonly SelectOption[];
  specificFields: readonly FieldSpec[];
  operationsFields: readonly string[];
  supportsDrafts: boolean;
  supportsWorkflowView: boolean;
};

type FieldSpec = {
  name: string;
  label: string;
  type?: 'text' | 'date' | 'dateTime' | 'number' | 'boolean' | 'address' | 'rawJson';
  description?: string;
  existingId?: string;
  isUnique?: boolean;
  isUIEditable?: boolean;
  displayedMaxRows?: number;
};

type SelectOption = {
  value: string;
  label: string;
  position: number;
  color: SelectColor;
};

const option = (value: string, label: string, position: number, color: SelectColor): SelectOption => ({
  value,
  label,
  position,
  color,
});

export const intakeUid = (seed: string): string => uuidv5(seed, APPLICATION_UNIVERSAL_IDENTIFIER);

const sharedFieldSpecs: readonly FieldSpec[] = [
  { name: 'name', label: 'Application' },
  {
    name: 'fairlendLeadId',
    label: 'FairLend Lead ID',
    description: 'Stable website UUID used as the cross-system idempotency key.',
    isUnique: true,
    isUIEditable: false,
  },
  { name: 'capturedAt', label: 'Captured At', type: 'dateTime' },
  { name: 'submittedAt', label: 'Submitted At', type: 'dateTime' },
  { name: 'nextActionAt', label: 'Next Action At', type: 'dateTime' },
  { name: 'intent', label: 'Intent' },
  { name: 'source', label: 'Source' },
  { name: 'page', label: 'Intake Page' },
  { name: 'campaign', label: 'Campaign' },
  { name: 'campaignScanId', label: 'Campaign Scan ID' },
  { name: 'contactName', label: 'Contact Name' },
  { name: 'email', label: 'Email' },
  { name: 'phone', label: 'Phone' },
  { name: 'companyName', label: 'Organization Name' },
  { name: 'propertyAddress', label: 'Property Address', type: 'address' },
  { name: 'formattedAddress', label: 'Formatted Address' },
  { name: 'googlePlaceId', label: 'Google Place ID' },
  { name: 'completionStatus', label: 'Form Completion Status' },
  { name: 'detail', label: 'Detail', displayedMaxRows: 8 },
  { name: 'message', label: 'Message', displayedMaxRows: 8 },
  { name: 'notes', label: 'Notes', displayedMaxRows: 8 },
  { name: 'intakeSummary', label: 'Intake Summary', displayedMaxRows: 4 },
  { name: 'adminNotes', label: 'Internal Notes', displayedMaxRows: 10 },
  { name: 'intakePayload', label: 'Full Intake Payload', type: 'rawJson', isUIEditable: false },
  { name: 'addressPayload', label: 'Address Payload', type: 'rawJson', isUIEditable: false },
  { name: 'attributionPayload', label: 'Attribution Payload', type: 'rawJson', isUIEditable: false },
];

const mortgageFields: readonly FieldSpec[] = [
  { name: 'amount', label: 'Requested Amount' },
  { name: 'mortgageProduct', label: 'Mortgage Product' },
  { name: 'mortgageGoal', label: 'Mortgage Goal' },
  { name: 'situation', label: 'Borrower Situation' },
  { name: 'situationType', label: 'Situation Type' },
  { name: 'propertyValue', label: 'Property Value' },
  { name: 'estimatedValue', label: 'Estimated Value' },
  { name: 'homepageValue', label: 'Homepage Value' },
  { name: 'currentMortgage', label: 'Current Mortgage' },
  { name: 'mortgageBalance', label: 'Mortgage Balance' },
  { name: 'additionalLiens', label: 'Additional Liens' },
  { name: 'additionalLienDetails', label: 'Additional Lien Details', displayedMaxRows: 6 },
  { name: 'additionalDebtAmount', label: 'Additional Debt Amount' },
  { name: 'timeline', label: 'Timeline' },
  { name: 'propertyUse', label: 'Property Use' },
  { name: 'occupancyStatus', label: 'Occupancy Status' },
  { name: 'ownershipStatus', label: 'Ownership Status' },
  { name: 'ownershipStructure', label: 'Ownership Structure' },
  { name: 'numberOfUnits', label: 'Number of Units' },
  { name: 'grossRentalIncome', label: 'Gross Rental Income' },
  { name: 'exitPlan', label: 'Exit Plan', displayedMaxRows: 6 },
  { name: 'documentStatus', label: 'Document Status' },
  { name: 'borrowerRole', label: 'Borrower Role' },
];

const lenderFields: readonly FieldSpec[] = [
  { name: 'applicantType', label: 'Applicant Type' },
  { name: 'deployableCapital', label: 'Deployable Capital' },
  { name: 'preferredReviewWindow', label: 'Preferred Review Window' },
  { name: 'lendingExperience', label: 'Lending Experience' },
  { name: 'mortgageLane', label: 'Mortgage Lane' },
  { name: 'investmentPriority', label: 'Investment Priority' },
  { name: 'investmentAmount', label: 'Investment Amount' },
  { name: 'investmentFocus', label: 'Investment Focus' },
];

const constructionFields: readonly FieldSpec[] = [
  { name: 'intakeVariant', label: 'Intake Variant' },
  { name: 'projectScope', label: 'Project Scope' },
  { name: 'buildType', label: 'Build Type' },
  { name: 'suiteType', label: 'Suite Type' },
  { name: 'projectStage', label: 'Project Stage' },
  { name: 'siteControl', label: 'Site Control' },
  { name: 'financingNeeds', label: 'Financing Needs' },
  { name: 'financingTimeline', label: 'Financing Timeline' },
  { name: 'requestedLoan', label: 'Requested Loan' },
  { name: 'projectCost', label: 'Project Cost' },
  { name: 'borrowerEquity', label: 'Borrower Equity' },
  { name: 'approximateEquity', label: 'Approximate Equity' },
  { name: 'borrowerExperience', label: 'Borrower Experience' },
  { name: 'projectTeam', label: 'Project Team' },
  { name: 'contactRole', label: 'Contact Role' },
  { name: 'unitCount', label: 'Unit Count' },
  { name: 'occupancy', label: 'Occupancy' },
  { name: 'buildPermitFileName', label: 'Build Permit File Name' },
  { name: 'termsAccepted', label: 'Terms Accepted', type: 'boolean' },
];

const partnerFields: readonly FieldSpec[] = [
  { name: 'partnerType', label: 'Partner Intake Type' },
  { name: 'partnerRole', label: 'Partner Role' },
  { name: 'amount', label: 'Amount' },
  { name: 'projectContext', label: 'Project Context', displayedMaxRows: 8 },
  { name: 'scenarioContext', label: 'Scenario Context', displayedMaxRows: 8 },
  {
    name: 'nextAction',
    label: 'Next Follow-up Objective',
    description: 'Projection of the earliest open Follow-up Action for operational queues.',
    displayedMaxRows: 4,
  },
  {
    name: 'nextFollowUpRequirements',
    label: 'Next Follow-up Requirements',
    description: 'Information, verification, asset, or response required to complete the next Follow-up Action.',
    displayedMaxRows: 10,
  },
  {
    name: 'nextFollowUpTaskKey',
    label: 'Next Follow-up Task Key',
    description: 'Stable FairLend key of the Task projected into this Partner Lead.',
    isUIEditable: false,
  },
  {
    name: 'nextFollowUpTaskId',
    label: 'Next Follow-up Task ID',
    description: 'Twenty record ID of the Task projected into this Partner Lead.',
    isUIEditable: false,
  },
  { name: 'lastContactAt', label: 'Last Contact At', type: 'dateTime' },
  { name: 'lastContactSummary', label: 'Last Contact Summary', displayedMaxRows: 6 },
  { name: 'followUpCount', label: 'Follow-up Count', type: 'number' },
  { name: 'primaryHook', label: 'Primary Hook', displayedMaxRows: 8 },
  { name: 'fitEvidence', label: 'Fit Evidence', displayedMaxRows: 10 },
  { name: 'opennessSignal', label: 'Partner-openness Signal', displayedMaxRows: 8 },
  { name: 'contactRoute', label: 'Primary Contact Route', displayedMaxRows: 6 },
  { name: 'companyWebsite', label: 'Company Website' },
  {
    name: 'publicContactSummary',
    label: 'Public Contact Summary',
    description: 'Complete attributable public contact routes found during research.',
    displayedMaxRows: 10,
  },
  { name: 'allContactEmails', label: 'All Public Contact Emails', displayedMaxRows: 6 },
  { name: 'allContactPhones', label: 'All Public Contact Phones', displayedMaxRows: 6 },
  { name: 'contactFormUrl', label: 'Contact Form URL' },
  { name: 'contactLocations', label: 'Public Service / Contact Locations', displayedMaxRows: 6 },
  {
    name: 'servicesSummary',
    label: 'Services Summary',
    description: 'Evidence-backed summary of the builder services relevant to the partnership.',
    displayedMaxRows: 10,
  },
  {
    name: 'buildPortfolioSummary',
    label: 'Build Portfolio Summary',
    description: 'Evidence-backed summary of completed, active, or announced builds.',
    displayedMaxRows: 12,
  },
  { name: 'buildPortfolioSourceUrls', label: 'Build Portfolio Source URLs', displayedMaxRows: 10 },
  { name: 'sourceUrls', label: 'Research Source URLs', displayedMaxRows: 10 },
  { name: 'verificationDate', label: 'Research Verified On', type: 'date' },
  { name: 'proposedOffer', label: 'Proposed Offer', displayedMaxRows: 10 },
  { name: 'firstCta', label: 'First CTA', displayedMaxRows: 8 },
  { name: 'objectionsAndRisks', label: 'Objections / Claims to Avoid', displayedMaxRows: 10 },
  { name: 'activityRecencyNotes', label: 'Activity / Recency Notes', displayedMaxRows: 8 },
  { name: 'activationDate', label: 'Activation / Session Date', type: 'dateTime' },
  { name: 'activationContext', label: 'Personalized Multi-channel Outreach Dossier', displayedMaxRows: 16 },
  { name: 'outreachEmail', label: 'Personalized Email Strategy & Script', displayedMaxRows: 12 },
  { name: 'outreachLinkedIn', label: 'LinkedIn / DM Strategy & Script', displayedMaxRows: 10 },
  { name: 'outreachPhoneAndForm', label: 'Phone / Voicemail / Contact-form Script', displayedMaxRows: 10 },
  { name: 'outreachFollowUps', label: 'Follow-up & Close-loop Sequence', displayedMaxRows: 10 },
  { name: 'outreachAsset', label: 'Recommended Outreach Asset / Tool', displayedMaxRows: 8 },
  { name: 'outreachGuardrails', label: 'Outreach Guardrails', displayedMaxRows: 10 },
  { name: 'outreachDossierSources', label: 'Outreach Dossier Source Documents', displayedMaxRows: 6 },
  { name: 'convertedAt', label: 'Converted At', type: 'dateTime' },
  { name: 'conversionOutcome', label: 'Conversion Outcome', displayedMaxRows: 8 },
  { name: 'reengageAt', label: 'Re-engage At', type: 'dateTime' },
  { name: 'pauseReason', label: 'Pause Reason', displayedMaxRows: 6 },
  { name: 'declineReason', label: 'Decline Reason', displayedMaxRows: 6 },
  { name: 'decisionMakerCount', label: 'Verified Decision-makers', type: 'number' },
  { name: 'companyMatchKey', label: 'Company Match Key', isUIEditable: false },
  { name: 'companySourceUrls', label: 'Company Verification Sources', displayedMaxRows: 8 },
  { name: 'companyVerifiedOn', label: 'Company Verified On', type: 'date' },
  { name: 'companyResearchNotes', label: 'Company Research Notes', displayedMaxRows: 10 },
  { name: 'peopleResearchSummary', label: 'Decision-maker Research Summary', displayedMaxRows: 10 },
];

const consultationFields: readonly FieldSpec[] = [
  { name: 'bookingId', label: 'Booking ID', existingId: CONSULTATION_FIELD_IDS.bookingId, isUnique: true, isUIEditable: false },
  { name: 'scheduledStart', label: 'Scheduled Start', type: 'dateTime', existingId: CONSULTATION_FIELD_IDS.scheduledStart },
  { name: 'scheduledEnd', label: 'Scheduled End', type: 'dateTime', existingId: CONSULTATION_FIELD_IDS.scheduledEnd },
  { name: 'timezone', label: 'Timezone', existingId: CONSULTATION_FIELD_IDS.timezone },
  { name: 'googleEventId', label: 'Google Event ID', existingId: CONSULTATION_FIELD_IDS.googleEventId },
  { name: 'googleEventLink', label: 'Google Event Link', existingId: CONSULTATION_FIELD_IDS.googleEventLink },
  { name: 'syncError', label: 'Sync Error', existingId: CONSULTATION_FIELD_IDS.syncError },
  { name: 'originatingLeadId', label: 'Originating Lead ID' },
  { name: 'originatingObjectKind', label: 'Originating Application Type' },
  { name: 'amountNeeded', label: 'Amount Needed' },
  { name: 'estimatedValue', label: 'Estimated Property Value' },
  { name: 'mortgageBalance', label: 'Mortgage Balance' },
  { name: 'situationType', label: 'Situation Type' },
  { name: 'timeline', label: 'Timeline' },
];

const generalFields: readonly FieldSpec[] = [
  { name: 'inquiryType', label: 'Inquiry Type' },
  { name: 'classificationStatus', label: 'Classification Status' },
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
  { name: 'inquiryRole', label: 'Role' },
  { name: 'situation', label: 'Situation' },
  { name: 'documentStatus', label: 'Document Status' },
  { name: 'amount', label: 'Amount' },
];

const newsletterFields: readonly FieldSpec[] = [
  { name: 'list', label: 'List' },
  { name: 'consentSource', label: 'Consent Source' },
  { name: 'consentText', label: 'Consent Text', displayedMaxRows: 8 },
  { name: 'consentVersion', label: 'Consent Version' },
  { name: 'subscribedAt', label: 'Subscribed At', type: 'dateTime' },
];

const definitions: Record<IntakeObjectKind, IntakeDefinition> = {
  mortgage: {
    kind: 'mortgage',
    objectId: intakeUid('object:mortgageBorrowerLead'),
    nameSingular: 'mortgageBorrowerLead',
    namePlural: 'mortgageBorrowerLeads',
    labelSingular: 'Mortgage Borrower Lead',
    labelPlural: 'Mortgage Borrower Leads',
    description: 'Borrower mortgage intake applications captured by FairLend.',
    icon: 'IconHomeDollar',
    workflowFieldName: 'workflowStatus',
    workflowOptions: [
      option('NEW', 'New', 0, 'blue'), option('CONTACT_ATTEMPTED', 'Contact Attempted', 1, 'yellow'),
      option('CONTACTED', 'Contacted', 2, 'purple'), option('QUALIFIED', 'Qualified', 3, 'green'),
      option('APPLICATION_IN_PROGRESS', 'Application in Progress', 4, 'orange'),
      option('SUBMITTED_TO_LENDER', 'Submitted to Lender', 5, 'blue'),
      option('COMMITMENT_ISSUED', 'Commitment Issued', 6, 'purple'),
      option('FUNDED', 'Funded', 7, 'green'), option('CLOSED_LOST', 'Closed Lost', 8, 'red'),
    ],
    specificFields: mortgageFields,
    operationsFields: ['name', 'workflowStatus', 'priority', 'amount', 'mortgageProduct', 'propertyValue', 'timeline', 'contactName', 'email', 'phone', 'capturedAt', 'submittedAt', 'nextActionAt'],
    supportsDrafts: true,
    supportsWorkflowView: true,
  },
  lender: {
    kind: 'lender',
    objectId: intakeUid('object:lenderApplication'),
    nameSingular: 'lenderApplication',
    namePlural: 'lenderApplications',
    labelSingular: 'Lender Application',
    labelPlural: 'Lender Applications',
    description: 'Prospective capital provider applications captured by FairLend.',
    icon: 'IconBuildingBank',
    workflowFieldName: 'workflowStatus',
    workflowOptions: [
      option('NEW', 'New', 0, 'blue'), option('CONTACTED', 'Contacted', 1, 'purple'),
      option('QUALIFIED', 'Qualified', 2, 'green'), option('DUE_DILIGENCE', 'Due Diligence', 3, 'orange'),
      option('APPROVED', 'Approved', 4, 'blue'), option('ACTIVE', 'Active', 5, 'green'),
      option('DECLINED', 'Declined', 6, 'red'), option('INACTIVE', 'Inactive', 7, 'gray'),
    ],
    specificFields: lenderFields,
    operationsFields: ['name', 'workflowStatus', 'priority', 'applicantType', 'deployableCapital', 'mortgageLane', 'investmentPriority', 'contactName', 'email', 'phone', 'capturedAt', 'submittedAt', 'nextActionAt'],
    supportsDrafts: true,
    supportsWorkflowView: true,
  },
  construction: {
    kind: 'construction',
    objectId: intakeUid('object:constructionApplication'),
    nameSingular: 'constructionApplication',
    namePlural: 'constructionApplications',
    labelSingular: 'Construction Application',
    labelPlural: 'Construction Applications',
    description: 'Construction and garden-suite financing applications captured by FairLend.',
    icon: 'IconBuildingCommunity',
    workflowFieldName: 'workflowStatus',
    workflowOptions: [
      option('NEW', 'New', 0, 'blue'), option('INITIAL_REVIEW', 'Initial Review', 1, 'purple'),
      option('DOCUMENTS_OUTSTANDING', 'Documents Outstanding', 2, 'yellow'),
      option('UNDERWRITING', 'Underwriting', 3, 'orange'), option('LENDER_REVIEW', 'Lender Review', 4, 'blue'),
      option('COMMITMENT_ISSUED', 'Commitment Issued', 5, 'purple'),
      option('FUNDING_AND_DRAWS', 'Funding & Draws', 6, 'green'), option('COMPLETED', 'Completed', 7, 'green'),
      option('DECLINED', 'Declined', 8, 'red'),
    ],
    specificFields: constructionFields,
    operationsFields: ['name', 'workflowStatus', 'priority', 'projectScope', 'projectStage', 'requestedLoan', 'projectCost', 'siteControl', 'contactName', 'email', 'phone', 'capturedAt', 'submittedAt', 'nextActionAt'],
    supportsDrafts: true,
    supportsWorkflowView: true,
  },
  partner: {
    kind: 'partner',
    objectId: intakeUid('object:partnerLead'),
    nameSingular: 'partnerLead',
    namePlural: 'partnerLeads',
    labelSingular: 'Partner Lead',
    labelPlural: 'Partner Leads',
    description: 'Partner applications, projects, and live financing scenarios.',
    icon: 'IconUsersGroup',
    workflowFieldName: 'workflowStatus',
    workflowOptions: [
      option('NEW', 'New', 0, 'blue'), option('CONTACTED', 'Contacted', 1, 'purple'),
      option('QUALIFIED', 'Qualified', 2, 'green'), option('ONBOARDING', 'Onboarding', 3, 'orange'),
      option('ACTIVE', 'Active', 4, 'green'), option('DECLINED', 'Declined', 5, 'red'),
      option('INACTIVE', 'Inactive', 6, 'gray'),
    ],
    specificFields: partnerFields,
    operationsFields: [
      'name', 'partnerCategory', 'partnershipStage', 'priority', 'engagementHealth',
      'owner', 'partnerRole', 'companyName', 'company', 'person', 'decisionMakerCount',
      'companyVerificationStatus', 'primaryDecisionMakerStatus', 'responseStatus', 'lastContactAt', 'nextActionAt',
      'nextFollowUpMethod', 'nextAction', 'nextFollowUpRequirements', 'campaign', 'followUpCount',
    ],
    supportsDrafts: true,
    supportsWorkflowView: true,
  },
  consultation: {
    kind: 'consultation',
    objectId: CONSULTATION_OBJECT_ID,
    nameSingular: 'fairlendConsultation',
    namePlural: 'fairlendConsultations',
    labelSingular: 'Consultation Request',
    labelPlural: 'Consultation Requests',
    description: 'Consultation requests and bookings created by FairLend intake and calendar flows.',
    icon: 'IconCalendarEvent',
    workflowFieldName: 'status',
    workflowOptions: [
      option('REQUESTED', 'Requested', 0, 'blue'), option('SCHEDULED', 'Scheduled', 1, 'yellow'),
      option('CONFIRMED', 'Confirmed', 2, 'green'), option('COMPLETED', 'Completed', 3, 'purple'),
      option('CANCELLED', 'Cancelled', 4, 'gray'), option('NO_SHOW', 'No Show', 5, 'red'),
      option('SYNCING', 'Syncing (Legacy)', 6, 'yellow'), option('SYNC_FAILED', 'Sync Failed', 7, 'red'),
    ],
    specificFields: consultationFields,
    operationsFields: ['name', 'status', 'scheduledStart', 'scheduledEnd', 'contactName', 'email', 'phone', 'capturedAt', 'submittedAt', 'source'],
    supportsDrafts: false,
    supportsWorkflowView: true,
  },
  general: {
    kind: 'general',
    objectId: intakeUid('object:generalInquiry'),
    nameSingular: 'generalInquiry',
    namePlural: 'generalInquiries',
    labelSingular: 'General Inquiry',
    labelPlural: 'General Inquiries',
    description: 'General contact, route-helper, unmatched document, and quarantined intake submissions.',
    icon: 'IconInbox',
    workflowFieldName: 'workflowStatus',
    workflowOptions: [
      option('NEW', 'New', 0, 'blue'), option('ASSIGNED', 'Assigned', 1, 'yellow'),
      option('RESPONDED', 'Responded', 2, 'purple'), option('RESOLVED', 'Resolved', 3, 'green'),
      option('SPAM', 'Spam', 4, 'red'),
    ],
    specificFields: generalFields,
    operationsFields: ['name', 'workflowStatus', 'priority', 'classificationStatus', 'inquiryType', 'contactName', 'email', 'phone', 'capturedAt', 'submittedAt', 'source', 'nextActionAt'],
    supportsDrafts: true,
    supportsWorkflowView: true,
  },
  newsletter: {
    kind: 'newsletter',
    objectId: intakeUid('object:newsletterSubscription'),
    nameSingular: 'newsletterSubscription',
    namePlural: 'newsletterSubscriptions',
    labelSingular: 'Newsletter Subscription',
    labelPlural: 'Newsletter Subscriptions',
    description: 'FairLend newsletter consent and subscription records.',
    icon: 'IconMail',
    workflowFieldName: 'status',
    workflowOptions: [
      option('SUBSCRIBED', 'Subscribed', 0, 'green'), option('UNSUBSCRIBED', 'Unsubscribed', 1, 'gray'),
      option('SUPPRESSED', 'Suppressed', 2, 'red'),
    ],
    specificFields: newsletterFields,
    operationsFields: ['name', 'status', 'email', 'list', 'consentSource', 'subscribedAt', 'capturedAt', 'submittedAt'],
    supportsDrafts: false,
    supportsWorkflowView: false,
  },
};

const captureStatusOptions = [
  option('DRAFT', 'Draft', 0, 'gray'),
  option('STARTED', 'Started', 1, 'blue'),
  option('SUBMITTED', 'Submitted', 2, 'green'),
];
const priorityOptions = [option('HIGH', 'High', 0, 'red'), option('NORMAL', 'Normal', 1, 'blue'), option('LOW', 'Low', 2, 'gray')];
const timestampOptions = [
  option('SOURCE_SUPPLIED', 'Source Supplied', 0, 'green'),
  option('INFERRED_CREATED_AT', 'Inferred from Captured At', 1, 'yellow'),
  option('NOT_SUBMITTED', 'Not Submitted', 2, 'gray'),
];
const consultationMilestoneOptions = [
  option('NONE', 'None', 0, 'gray'), option('REQUESTED', 'Requested', 1, 'blue'),
  option('SCHEDULED', 'Scheduled', 2, 'yellow'), option('COMPLETED', 'Completed', 3, 'green'),
];

export const PARTNER_CATEGORY_OPTIONS = [
  option('BUILDER_PROFESSIONAL', 'Builders & Early-file Professionals', 0, 'blue'),
  option('PODCAST_MEDIA', 'Podcasts & Media', 1, 'purple'),
  option('INVESTOR_GROUP', 'Investor Groups & Associations', 2, 'green'),
  option('MEETUP_COMMUNITY', 'Meetups & Recurring Communities', 3, 'orange'),
  option('TRADE_SHOW_EVENT', 'Trade Shows & Events', 4, 'yellow'),
  option('OTHER', 'Other Partnership', 5, 'gray'),
] as const;

export const PARTNERSHIP_STAGE_OPTIONS = [
  option('RESEARCHED', 'Researched', 0, 'gray'),
  option('QUALIFIED', 'Qualified', 1, 'blue'),
  option('BUILDER_OUTREACH_READY', 'Outreach Ready', 2, 'yellow'),
  option('BUILDER_CONTACTED', 'Contacted', 3, 'purple'),
  option('BUILDER_DISCOVERY', 'Discovery', 4, 'orange'),
  option('BUILDER_FILE_PILOT_PROPOSED', 'File Pilot Proposed', 5, 'blue'),
  option('BUILDER_PILOT_ACTIVE', 'Pilot Active', 6, 'purple'),
  option('BUILDER_PARTNER_ONBOARDING', 'Partner Onboarding', 7, 'orange'),
  option('BUILDER_ACTIVE_PARTNER', 'Active Partner', 8, 'green'),
  option('MEDIA_PITCH_READY', 'Pitch Ready', 9, 'yellow'),
  option('MEDIA_PITCHED', 'Pitched', 10, 'purple'),
  option('MEDIA_EDITORIAL_REVIEW', 'Editorial Review', 11, 'orange'),
  option('MEDIA_BOOKED', 'Booked', 12, 'blue'),
  option('MEDIA_RECORDED', 'Recorded', 13, 'purple'),
  option('MEDIA_PUBLISHED', 'Published', 14, 'green'),
  option('MEDIA_RECURRING_PARTNER', 'Recurring Media Partner', 15, 'green'),
  option('COMMUNITY_PROGRAM_PROPOSED', 'Program Proposed', 16, 'yellow'),
  option('COMMUNITY_ORGANIZER_REVIEW', 'Organizer Review', 17, 'orange'),
  option('COMMUNITY_SESSION_SCHEDULED', 'Session Scheduled', 18, 'blue'),
  option('COMMUNITY_PROMOTION_ACTIVE', 'Promotion Active', 19, 'purple'),
  option('COMMUNITY_DELIVERED', 'Delivered', 20, 'green'),
  option('COMMUNITY_FOLLOW_UP', 'Member Follow-up', 21, 'orange'),
  option('COMMUNITY_RECURRING_PARTNER', 'Recurring Community Partner', 22, 'green'),
  option('EVENT_PROSPECTUS_REVIEWED', 'Prospectus Reviewed', 23, 'yellow'),
  option('EVENT_CONTACTED', 'Event Contacted', 24, 'purple'),
  option('EVENT_ACTIVATION_SUBMITTED', 'Speaking / Activation Submitted', 25, 'blue'),
  option('EVENT_NEGOTIATION', 'Negotiation', 26, 'orange'),
  option('EVENT_BOOKED', 'Event Booked', 27, 'blue'),
  option('EVENT_PRE_EVENT', 'Pre-event', 28, 'purple'),
  option('EVENT_DELIVERED', 'Event Delivered', 29, 'green'),
  option('EVENT_POST_EVENT_CONVERSION', 'Post-event Conversion', 30, 'orange'),
  option('EVENT_RECURRING_PARTNER', 'Recurring Event Partner', 31, 'green'),
  option('NURTURE', 'Nurture', 32, 'gray'),
  option('REENGAGEMENT', 'Re-engagement', 33, 'yellow'),
  option('PAUSED', 'Paused', 34, 'gray'),
  option('DECLINED', 'Declined', 35, 'red'),
  option('CONVERTED', 'Converted', 36, 'green'),
] as const;

export const PARTNER_OPERATIONAL_SELECTS = [
  { name: 'partnerCategory', label: 'Partner Category', options: PARTNER_CATEGORY_OPTIONS, defaultValue: 'OTHER' },
  { name: 'partnershipStage', label: 'Partnership Stage', options: PARTNERSHIP_STAGE_OPTIONS, defaultValue: 'RESEARCHED' },
  {
    name: 'engagementHealth', label: 'Engagement Health', defaultValue: 'ACTIVE', options: [
      option('ACTIVE', 'Active', 0, 'green'), option('AWAITING_RESPONSE', 'Awaiting Response', 1, 'blue'),
      option('NEEDS_VERIFICATION', 'Needs Verification', 2, 'yellow'), option('STALE', 'Stale', 3, 'orange'),
      option('PAUSED', 'Paused', 4, 'gray'), option('NURTURE', 'Nurture', 5, 'purple'),
      option('DECLINED', 'Declined', 6, 'red'), option('CONVERTED', 'Converted', 7, 'green'),
    ],
  },
  {
    name: 'responseStatus', label: 'External Response', defaultValue: 'NOT_CONTACTED', options: [
      option('NOT_CONTACTED', 'Not Contacted', 0, 'gray'), option('AWAITING_RESPONSE', 'Awaiting Response', 1, 'yellow'),
      option('RESPONDED', 'Responded', 2, 'green'), option('NO_RESPONSE', 'No Response', 3, 'orange'),
      option('DO_NOT_CONTACT', 'Do Not Contact', 4, 'red'),
    ],
  },
  {
    name: 'nextFollowUpMethod', label: 'Next Follow-up Method', defaultValue: 'OTHER', options: [
      option('EMAIL', 'Email', 0, 'blue'), option('LINKEDIN', 'LinkedIn', 1, 'purple'),
      option('PHONE', 'Phone', 2, 'green'), option('CONTACT_FORM', 'Contact Form', 3, 'yellow'),
      option('MEETING', 'Meeting', 4, 'orange'), option('RESEARCH', 'Research / Verification', 5, 'crimson'),
      option('OTHER', 'Other', 6, 'gray'),
    ],
  },
  {
    name: 'lastContactChannel', label: 'Last Contact Channel', defaultValue: 'NONE', options: [
      option('NONE', 'None', 0, 'gray'), option('EMAIL', 'Email', 1, 'blue'),
      option('LINKEDIN', 'LinkedIn', 2, 'purple'), option('PHONE', 'Phone', 3, 'green'),
      option('CONTACT_FORM', 'Contact Form', 4, 'yellow'), option('EVENT', 'Event / In Person', 5, 'orange'),
      option('OTHER', 'Other', 6, 'gray'),
    ],
  },
  {
    name: 'proposalReviewStatus', label: 'Proposal / Program Review', defaultValue: 'NOT_STARTED', options: [
      option('NOT_STARTED', 'Not Started', 0, 'gray'), option('READY_TO_SUBMIT', 'Ready to Submit', 1, 'yellow'),
      option('SUBMITTED', 'Submitted', 2, 'blue'), option('UNDER_REVIEW', 'Under Review', 3, 'orange'),
      option('REVISION_REQUESTED', 'Revision Requested', 4, 'purple'), option('APPROVED', 'Approved', 5, 'green'),
      option('DECLINED', 'Declined', 6, 'red'),
    ],
  },
  {
    name: 'activationType', label: 'Activation Type', defaultValue: 'NONE', options: [
      option('NONE', 'None', 0, 'gray'), option('FILE_PILOT', 'File Pilot', 1, 'blue'),
      option('EDITORIAL_EPISODE', 'Editorial Episode', 2, 'purple'), option('MEMBER_PROGRAM', 'Member Program', 3, 'green'),
      option('MEETUP_SESSION', 'Meetup Session', 4, 'orange'), option('EVENT_ACTIVATION', 'Event Activation', 5, 'yellow'),
    ],
  },
  {
    name: 'activationStatus', label: 'Activation Status', defaultValue: 'NOT_PROPOSED', options: [
      option('NOT_PROPOSED', 'Not Proposed', 0, 'gray'), option('PROPOSED', 'Proposed', 1, 'yellow'),
      option('UNDER_REVIEW', 'Under Review', 2, 'orange'), option('SCHEDULED', 'Scheduled / Booked', 3, 'blue'),
      option('PROMOTION_ACTIVE', 'Promotion Active', 4, 'purple'), option('IN_PROGRESS', 'In Progress', 5, 'orange'),
      option('DELIVERED', 'Delivered', 6, 'green'), option('PUBLISHED', 'Published', 7, 'green'),
      option('COMPLETED', 'Completed', 8, 'green'), option('CANCELLED', 'Cancelled', 9, 'red'),
    ],
  },
  {
    name: 'activityRecencyStatus', label: 'Activity / Recency Status', defaultValue: 'CURRENT', options: [
      option('CURRENT', 'Current', 0, 'green'), option('VERIFY_BEFORE_OUTREACH', 'Verify Before Outreach', 1, 'yellow'),
      option('POSSIBLY_PAUSED', 'Possibly Paused', 2, 'orange'), option('STALE', 'Stale', 3, 'red'),
      option('NOT_APPLICABLE', 'Not Applicable', 4, 'gray'),
    ],
  },
  {
    name: 'companyVerificationStatus', label: 'Company Verification', defaultValue: 'UNVERIFIED', options: [
      option('VERIFIED', 'Verified', 0, 'green'), option('NEEDS_REVERIFY', 'Needs Re-verification', 1, 'yellow'),
      option('UNVERIFIED', 'Unverified', 2, 'gray'), option('NO_LEGAL_ENTITY_FOUND', 'No Legal Entity Found', 3, 'orange'),
    ],
  },
  {
    name: 'primaryDecisionMakerStatus', label: 'Primary Decision-maker', defaultValue: 'UNVERIFIED', options: [
      option('VERIFIED', 'Verified', 0, 'green'), option('NEEDS_REVERIFY', 'Needs Re-verification', 1, 'yellow'),
      option('UNVERIFIED', 'Unverified', 2, 'gray'), option('PUBLIC_DETAILS_UNAVAILABLE', 'Public Details Unavailable', 3, 'orange'),
    ],
  },
] as const;

const legacyConsultationFieldIds: Record<string, string> = {
  name: CONSULTATION_FIELD_IDS.name,
  status: CONSULTATION_FIELD_IDS.status,
  contactName: CONSULTATION_FIELD_IDS.contactName,
  email: CONSULTATION_FIELD_IDS.email,
  phone: CONSULTATION_FIELD_IDS.phone,
  notes: CONSULTATION_FIELD_IDS.notes,
  person: CONSULTATION_FIELD_IDS.person,
  bookingId: CONSULTATION_FIELD_IDS.bookingId,
  scheduledStart: CONSULTATION_FIELD_IDS.scheduledStart,
  scheduledEnd: CONSULTATION_FIELD_IDS.scheduledEnd,
  timezone: CONSULTATION_FIELD_IDS.timezone,
  googleEventId: CONSULTATION_FIELD_IDS.googleEventId,
  googleEventLink: CONSULTATION_FIELD_IDS.googleEventLink,
  syncError: CONSULTATION_FIELD_IDS.syncError,
};

const legacyConsultationOperationsViewFields: Record<string, { id: string; size: number }> = {
  name: { id: 'fc50b9a4-d16b-4bd7-b3f0-f65aa0c901ff', size: 240 },
  status: { id: 'd4796a5d-8310-4a90-b8c7-481197a6c930', size: 150 },
  scheduledStart: { id: 'e91ef7fd-6462-4f9a-92a9-8a2c4e86a145', size: 190 },
  contactName: { id: '003455a9-e242-40b3-9ab4-e45b67d6cd6e', size: 180 },
  email: { id: 'f34569fe-776b-4c98-8620-a326007abce1', size: 220 },
  phone: { id: 'ef2a96d7-4caf-4895-b624-7afdb8c81206', size: 160 },
};

const LEGACY_CONSULTATION_OPERATIONS_SORT_ID = '2b17db83-7606-4e57-928a-2834f07ae1b8';

export const getIntakeDefinition = (kind: IntakeObjectKind): IntakeDefinition => definitions[kind];

export const getIntakeFieldId = (kind: IntakeObjectKind, fieldName: string): string =>
  kind === 'consultation' && legacyConsultationFieldIds[fieldName]
    ? legacyConsultationFieldIds[fieldName]
    : intakeUid(`field:${definitions[kind].nameSingular}:${fieldName}`);

export const getCampaignTouchRelationFieldId = (kind: IntakeObjectKind): string =>
  intakeUid(`field:campaignTouch:${definitions[kind].nameSingular}`);

export const getStandardRelationFieldId = (
  standardObject: 'person' | 'company' | 'workspaceMember',
  kind: IntakeObjectKind,
): string => standardObject === 'person' && kind === 'consultation'
  ? STANDARD_OBJECT_RELATION_FIELD_IDS.personConsultations
  : intakeUid(`field:${standardObject}:${definitions[kind].namePlural}`);

const fieldFromSpec = (kind: IntakeObjectKind, spec: FieldSpec): ObjectField => {
  const universalIdentifier = spec.existingId ?? getIntakeFieldId(kind, spec.name);
  const common = {
    universalIdentifier,
    name: spec.name,
    label: kind === 'partner' && spec.name === 'nextActionAt' ? 'Next Follow-up At' : spec.label,
    description: kind === 'partner' && spec.name === 'nextActionAt'
      ? 'Due time of the earliest open Follow-up Action projected into this Partner Lead.'
      : spec.description,
    isNullable: true,
    isUnique: spec.isUnique,
    isUIEditable: spec.isUIEditable,
    universalSettings: spec.displayedMaxRows ? { displayedMaxRows: spec.displayedMaxRows } : undefined,
  };

  switch (spec.type) {
    case 'date': return { ...common, type: FieldType.DATE } as ObjectField;
    case 'dateTime': return { ...common, type: FieldType.DATE_TIME } as ObjectField;
    case 'number': return { ...common, type: FieldType.NUMBER } as ObjectField;
    case 'boolean': return { ...common, type: FieldType.BOOLEAN } as ObjectField;
    case 'address': return { ...common, type: FieldType.ADDRESS } as ObjectField;
    case 'rawJson': return { ...common, type: FieldType.RAW_JSON } as ObjectField;
    default: return { ...common, type: FieldType.TEXT } as ObjectField;
  }
};

const selectField = (
  kind: IntakeObjectKind,
  name: string,
  label: string,
  options: readonly SelectOption[],
  defaultValue: string,
): ObjectField => ({
  universalIdentifier: getIntakeFieldId(kind, name),
  type: FieldType.SELECT,
  name,
  label,
  isNullable: false,
  defaultValue: `'${defaultValue}'`,
  options: [...options],
}) as ObjectField;

const relationField = ({
  kind,
  name,
  label,
  targetObjectId,
  targetFieldId,
  relationType,
}: {
  kind: IntakeObjectKind;
  name: string;
  label: string;
  targetObjectId: string;
  targetFieldId: string;
  relationType: RelationType;
}): ObjectField => ({
  universalIdentifier: getIntakeFieldId(kind, name),
  type: FieldType.RELATION,
  name,
  label,
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: targetObjectId,
  relationTargetFieldMetadataUniversalIdentifier: targetFieldId,
  universalSettings: {
    relationType,
    ...(relationType === RelationType.MANY_TO_ONE ? { joinColumnName: `${name}Id` } : {}),
  },
}) as ObjectField;

const buildRelations = (kind: IntakeObjectKind): ObjectField[] => {
  const definition = definitions[kind];
  const relations: ObjectField[] = [
    relationField({
      kind,
      name: 'person',
      label: 'Person',
      targetObjectId: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
      targetFieldId: getStandardRelationFieldId('person', kind),
      relationType: RelationType.MANY_TO_ONE,
    }),
    relationField({
      kind,
      name: 'company',
      label: 'Company',
      targetObjectId: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
      targetFieldId: getStandardRelationFieldId('company', kind),
      relationType: RelationType.MANY_TO_ONE,
    }),
    relationField({
      kind,
      name: 'campaignTouches',
      label: 'Campaign Touches',
      targetObjectId: CAMPAIGN_TOUCH_OBJECT_ID,
      targetFieldId: getCampaignTouchRelationFieldId(kind),
      relationType: RelationType.ONE_TO_MANY,
    }),
  ];

  if (kind === 'mortgage' || kind === 'lender' || kind === 'construction' || kind === 'partner') {
    relations.push(relationField({
      kind,
      name: 'consultations',
      label: 'Consultation Requests',
      targetObjectId: CONSULTATION_OBJECT_ID,
      targetFieldId: getIntakeFieldId('consultation', definition.nameSingular),
      relationType: RelationType.ONE_TO_MANY,
    }));
  }

  if (kind === 'partner') {
    relations.push(relationField({
      kind,
      name: 'owner',
      label: 'Partnership Owner',
      targetObjectId: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
      targetFieldId: getStandardRelationFieldId('workspaceMember', kind),
      relationType: RelationType.MANY_TO_ONE,
    }));
    relations.push(relationField({
      kind,
      name: 'constructionApplications',
      label: 'Construction Applications',
      targetObjectId: definitions.construction.objectId,
      targetFieldId: getIntakeFieldId('construction', 'referringPartner'),
      relationType: RelationType.ONE_TO_MANY,
    }));
    relations.push({
      universalIdentifier: getIntakeFieldId('partner', 'decisionMakerLinks'),
      type: FieldType.RELATION,
      name: 'decisionMakerLinks',
      label: 'Verified Decision-makers',
      isNullable: true,
      relationTargetObjectMetadataUniversalIdentifier: PARTNER_CONTACT_OBJECT_ID,
      relationTargetFieldMetadataUniversalIdentifier: PARTNER_CONTACT_FIELD_IDS.partnerLead,
      universalSettings: { relationType: RelationType.ONE_TO_MANY },
    } as ObjectField);
  }

  if (kind === 'construction') {
    relations.push(relationField({
      kind,
      name: 'referringPartner',
      label: 'Referring Partner',
      targetObjectId: definitions.partner.objectId,
      targetFieldId: getIntakeFieldId('partner', 'constructionApplications'),
      relationType: RelationType.MANY_TO_ONE,
    }));
  }

  if (kind === 'consultation') {
    for (const originKind of ['mortgage', 'lender', 'construction', 'partner'] as const) {
      relations.push(relationField({
        kind,
        name: definitions[originKind].nameSingular,
        label: definitions[originKind].labelSingular,
        targetObjectId: definitions[originKind].objectId,
        targetFieldId: getIntakeFieldId(originKind, 'consultations'),
        relationType: RelationType.MANY_TO_ONE,
      }));
    }
    relations.push({
      universalIdentifier: CONSULTATION_FIELD_IDS.mortgageLead,
      type: FieldType.RELATION,
      name: 'mortgageLead',
      label: 'Legacy Intake Lead',
      isNullable: true,
      relationTargetObjectMetadataUniversalIdentifier: MORTGAGE_LEAD_OBJECT_ID,
      relationTargetFieldMetadataUniversalIdentifier: MORTGAGE_LEAD_FIELD_IDS.consultations,
      universalSettings: { relationType: RelationType.MANY_TO_ONE, joinColumnName: 'mortgageLeadId' },
    } as ObjectField);
  }

  return relations;
};

export const buildIntakeObjectConfig = (kind: IntakeObjectKind): ObjectConfig => {
  const definition = definitions[kind];
  const fields: ObjectField[] = [
    ...sharedFieldSpecs.map((spec) => fieldFromSpec(kind, spec)),
    selectField(kind, 'captureStatus', 'Capture Status', captureStatusOptions, kind === 'newsletter' ? 'SUBMITTED' : 'STARTED'),
    selectField(kind, definition.workflowFieldName, definition.workflowFieldName === 'status' ? 'Status' : 'Workflow Status', definition.workflowOptions, definition.workflowOptions[0].value),
    selectField(kind, 'priority', 'Priority', priorityOptions, 'NORMAL'),
    selectField(kind, 'timestampProvenance', 'Submitted Timestamp Source', timestampOptions, 'NOT_SUBMITTED'),
    ...definition.specificFields.map((spec) => fieldFromSpec(kind, spec)),
  ];

  if (kind === 'partner') {
    for (const field of PARTNER_OPERATIONAL_SELECTS) {
      fields.push(selectField(kind, field.name, field.label, field.options, field.defaultValue));
    }
  }

  if (kind === 'mortgage' || kind === 'lender' || kind === 'construction' || kind === 'partner') {
    fields.push(selectField(kind, 'consultationMilestone', 'Consultation Milestone', consultationMilestoneOptions, 'NONE'));
  }

  fields.push(...buildRelations(kind));

  return {
    universalIdentifier: definition.objectId,
    nameSingular: definition.nameSingular,
    namePlural: definition.namePlural,
    labelSingular: definition.labelSingular,
    labelPlural: definition.labelPlural,
    description: definition.description,
    icon: definition.icon,
    isSearchable: true,
    isUICreatable: true,
    isUIEditable: true,
    labelIdentifierFieldMetadataUniversalIdentifier: getIntakeFieldId(kind, 'name'),
    fields,
  };
};

export const buildStandardRelationConfig = (
  kind: IntakeObjectKind,
  standardObject: 'person' | 'company' | 'workspaceMember',
): FieldConfig => {
  const definition = definitions[kind];
  return {
    universalIdentifier: getStandardRelationFieldId(standardObject, kind),
    type: FieldType.RELATION,
    objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS[standardObject].universalIdentifier,
    name: standardObject === 'workspaceMember'
      ? 'ownedFairlendPartnerLeads'
      : `fairlend${definition.namePlural[0].toUpperCase()}${definition.namePlural.slice(1)}`,
    label: `FairLend ${definition.labelPlural}`,
    isNullable: true,
    relationTargetObjectMetadataUniversalIdentifier: definition.objectId,
    relationTargetFieldMetadataUniversalIdentifier: getIntakeFieldId(
      kind,
      standardObject === 'workspaceMember' ? 'owner' : standardObject,
    ),
    universalSettings: { relationType: RelationType.ONE_TO_MANY },
  } as FieldConfig;
};

export const buildCampaignTouchRelationConfig = (kind: IntakeObjectKind): ObjectField => ({
  universalIdentifier: getCampaignTouchRelationFieldId(kind),
  type: FieldType.RELATION,
  name: definitions[kind].nameSingular,
  label: definitions[kind].labelSingular,
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: definitions[kind].objectId,
  relationTargetFieldMetadataUniversalIdentifier: getIntakeFieldId(kind, 'campaignTouches'),
  universalSettings: { relationType: RelationType.MANY_TO_ONE, joinColumnName: `${definitions[kind].nameSingular}Id` },
}) as ObjectField;

export const getAllPromotedFieldNames = (kind: IntakeObjectKind): string[] => {
  const definition = definitions[kind];
  const names = [
    ...sharedFieldSpecs.filter((field) => field.type !== 'rawJson').map((field) => field.name),
    'captureStatus',
    definition.workflowFieldName,
    'priority',
    'timestampProvenance',
    ...definition.specificFields.map((field) => field.name),
    'person',
    'company',
  ];
  if (kind === 'partner') {
    names.push(...PARTNER_OPERATIONAL_SELECTS.map((field) => field.name), 'owner', 'decisionMakerLinks');
  }
  if (kind === 'mortgage' || kind === 'lender' || kind === 'construction' || kind === 'partner') names.push('consultationMilestone');
  return [...new Set(names)];
};

const viewField = (kind: IntakeObjectKind, viewKind: IntakeViewKind, fieldName: string, position: number) => {
  const deployedConsultationField = kind === 'consultation' && viewKind === 'operations'
    ? legacyConsultationOperationsViewFields[fieldName]
    : undefined;

  return {
    universalIdentifier: deployedConsultationField?.id ?? intakeUid(`view-field:${kind}:${viewKind}:${fieldName}`),
    fieldMetadataUniversalIdentifier: getIntakeFieldId(kind, fieldName),
    position,
    isVisible: true,
    size: deployedConsultationField?.size ?? (fieldName === 'name' ? 240 : fieldName === 'email' ? 220 : 170),
  };
};

export const getIntakeViewId = (kind: IntakeObjectKind, viewKind: IntakeViewKind): string =>
  kind === 'consultation' && viewKind === 'operations'
    ? VIEW_IDS.consultations
    : intakeUid(`view:${definitions[kind].nameSingular}:${viewKind}`);

export const buildIntakeViewConfig = (kind: IntakeObjectKind, viewKind: IntakeViewKind): ViewConfig => {
  const definition = definitions[kind];
  const fieldNames = viewKind === 'all-fields' ? getAllPromotedFieldNames(kind) : [...definition.operationsFields];
  const filters = viewKind === 'drafts'
    ? [{
        universalIdentifier: intakeUid(`view-filter:${kind}:drafts:captureStatus`),
        fieldMetadataUniversalIdentifier: getIntakeFieldId(kind, 'captureStatus'),
        operand: ViewFilterOperand.IS,
        value: ['DRAFT'],
      }]
    : viewKind === 'operations' && definition.supportsDrafts
      ? [{
          universalIdentifier: intakeUid(`view-filter:${kind}:operations:captureStatus`),
          fieldMetadataUniversalIdentifier: getIntakeFieldId(kind, 'captureStatus'),
          operand: ViewFilterOperand.IS_NOT,
          value: ['DRAFT'],
        }]
      : undefined;

  const name = viewKind === 'operations'
    ? `${definition.labelPlural} — Operations`
    : viewKind === 'all-fields'
      ? `${definition.labelPlural} — All Intake Fields`
      : viewKind === 'drafts'
        ? `${definition.labelPlural} — Drafts`
        : `${definition.labelPlural} — Workflow`;

  return {
    universalIdentifier: getIntakeViewId(kind, viewKind),
    name,
    objectUniversalIdentifier: definition.objectId,
    icon: definition.icon,
    ...(viewKind === 'operations' ? { key: ViewKey.INDEX } : {}),
    ...(viewKind === 'workflow'
      ? {
          type: ViewType.KANBAN,
          mainGroupByFieldMetadataUniversalIdentifier: getIntakeFieldId(kind, definition.workflowFieldName),
          shouldHideEmptyGroups: false,
        }
      : { type: ViewType.TABLE }),
    position: viewKind === 'operations' ? 0 : viewKind === 'all-fields' ? 1 : viewKind === 'drafts' ? 2 : 3,
    fields: fieldNames.map((fieldName, position) => viewField(kind, viewKind, fieldName, position)),
    filters,
    sorts: viewKind === 'operations' || viewKind === 'all-fields'
      ? [{
          universalIdentifier: kind === 'consultation' && viewKind === 'operations'
            ? LEGACY_CONSULTATION_OPERATIONS_SORT_ID
            : intakeUid(`view-sort:${kind}:${viewKind}:capturedAt`),
          fieldMetadataUniversalIdentifier: getIntakeFieldId(kind, 'capturedAt'),
          direction: ViewSortDirection.DESC,
        }]
      : undefined,
  } as ViewConfig;
};

export const buildNavigationConfig = (kind: IntakeObjectKind, position: number) => ({
  universalIdentifier: kind === 'consultation'
    ? NAVIGATION_IDS.consultations
    : intakeUid(`navigation:${definitions[kind].nameSingular}:operations`),
  name: definitions[kind].labelPlural,
  icon: definitions[kind].icon,
  position,
  viewUniversalIdentifier: getIntakeViewId(kind, 'operations'),
});

export const INTAKE_FIELD_REGISTRY: Record<IntakeObjectKind, readonly string[]> = {
  mortgage: mortgageFields.map((field) => field.name),
  lender: lenderFields.map((field) => field.name),
  construction: constructionFields.map((field) => field.name),
  partner: partnerFields.map((field) => field.name),
  consultation: consultationFields.map((field) => field.name),
  general: generalFields.map((field) => field.name),
  newsletter: newsletterFields.map((field) => field.name),
};

export const LEGACY_RELATION_IDS = {
  personMortgageLeads: STANDARD_OBJECT_RELATION_FIELD_IDS.personMortgageLeads,
  companyMortgageLeads: STANDARD_OBJECT_RELATION_FIELD_IDS.companyMortgageLeads,
  personConsultations: STANDARD_OBJECT_RELATION_FIELD_IDS.personConsultations,
  campaignTouchMortgageLead: CAMPAIGN_TOUCH_FIELD_IDS.mortgageLead,
};
