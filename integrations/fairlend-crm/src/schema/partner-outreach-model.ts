import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import {
  getIntakeDefinition,
  getIntakeFieldId,
  intakeUid,
} from 'src/schema/intake-model';

type ViewConfig = Parameters<typeof defineView>[0];

export type PartnerBoardKind =
  | 'builders'
  | 'podcasts'
  | 'investor-groups'
  | 'meetups'
  | 'trade-shows';

export type PartnerQueueKind =
  | 'actions-due-now'
  | 'overdue-follow-ups'
  | 'high-priority-uncontacted'
  | 'awaiting-response'
  | 'active-opportunities'
  | 'nurture-reengagement'
  | 'converted-activations';

type BoardDefinition = {
  name: string;
  icon: string;
  category: string;
  stages: readonly string[];
  fields: readonly string[];
};

const COMMON_START = ['RESEARCHED', 'QUALIFIED'] as const;
const COMMON_MAINTENANCE = ['NURTURE', 'REENGAGEMENT', 'PAUSED', 'DECLINED', 'CONVERTED'] as const;
const ENTITY_CARD_FIELDS = [
  'company', 'person', 'decisionMakerCount',
  'companyVerificationStatus', 'primaryDecisionMakerStatus',
] as const;

export const PARTNER_BOARD_DEFINITIONS: Record<PartnerBoardKind, BoardDefinition> = {
  builders: {
    name: 'Builders & Early-file Professionals — Partnership Pipeline',
    icon: 'IconBuildingCommunity',
    category: 'BUILDER_PROFESSIONAL',
    stages: [
      ...COMMON_START,
      'BUILDER_OUTREACH_READY', 'BUILDER_CONTACTED', 'BUILDER_DISCOVERY',
      'BUILDER_FILE_PILOT_PROPOSED', 'BUILDER_PILOT_ACTIVE',
      'BUILDER_PARTNER_ONBOARDING', 'BUILDER_ACTIVE_PARTNER',
      ...COMMON_MAINTENANCE,
    ],
    fields: [
      'name', 'priority', 'engagementHealth', 'owner', ...ENTITY_CARD_FIELDS, 'partnerRole', 'proposedOffer',
      'proposalReviewStatus', 'activationStatus', 'lastContactAt', 'nextActionAt',
      'nextAction', 'campaign', 'followUpCount',
    ],
  },
  podcasts: {
    name: 'Podcasts & Media — Editorial Pipeline',
    icon: 'IconMicrophone',
    category: 'PODCAST_MEDIA',
    stages: [
      ...COMMON_START,
      'MEDIA_PITCH_READY', 'MEDIA_PITCHED', 'MEDIA_EDITORIAL_REVIEW', 'MEDIA_BOOKED',
      'MEDIA_RECORDED', 'MEDIA_PUBLISHED', 'MEDIA_RECURRING_PARTNER',
      ...COMMON_MAINTENANCE,
    ],
    fields: [
      'name', 'priority', 'engagementHealth', 'owner', ...ENTITY_CARD_FIELDS, 'activityRecencyStatus',
      'primaryHook', 'proposedOffer', 'proposalReviewStatus', 'activationStatus',
      'lastContactAt', 'nextActionAt', 'nextAction', 'campaign', 'followUpCount',
    ],
  },
  'investor-groups': {
    name: 'Investor Groups & Associations — Program Pipeline',
    icon: 'IconBuildingBank',
    category: 'INVESTOR_GROUP',
    stages: [
      ...COMMON_START,
      'COMMUNITY_PROGRAM_PROPOSED', 'COMMUNITY_ORGANIZER_REVIEW',
      'COMMUNITY_SESSION_SCHEDULED', 'COMMUNITY_PROMOTION_ACTIVE',
      'COMMUNITY_DELIVERED', 'COMMUNITY_FOLLOW_UP', 'COMMUNITY_RECURRING_PARTNER',
      ...COMMON_MAINTENANCE,
    ],
    fields: [
      'name', 'priority', 'engagementHealth', 'owner', ...ENTITY_CARD_FIELDS, 'partnerRole', 'proposedOffer',
      'proposalReviewStatus', 'activationDate', 'activationStatus', 'lastContactAt',
      'nextActionAt', 'nextAction', 'campaign', 'followUpCount',
    ],
  },
  meetups: {
    name: 'Meetups & Recurring Communities — Session Pipeline',
    icon: 'IconUsersGroup',
    category: 'MEETUP_COMMUNITY',
    stages: [
      ...COMMON_START,
      'COMMUNITY_PROGRAM_PROPOSED', 'COMMUNITY_ORGANIZER_REVIEW',
      'COMMUNITY_SESSION_SCHEDULED', 'COMMUNITY_PROMOTION_ACTIVE',
      'COMMUNITY_DELIVERED', 'COMMUNITY_FOLLOW_UP', 'COMMUNITY_RECURRING_PARTNER',
      ...COMMON_MAINTENANCE,
    ],
    fields: [
      'name', 'priority', 'engagementHealth', 'owner', ...ENTITY_CARD_FIELDS, 'activityRecencyStatus',
      'proposedOffer', 'proposalReviewStatus', 'activationDate', 'activationStatus',
      'lastContactAt', 'nextActionAt', 'nextAction', 'campaign', 'followUpCount',
    ],
  },
  'trade-shows': {
    name: 'Trade Shows & Events — Activation Pipeline',
    icon: 'IconCalendarEvent',
    category: 'TRADE_SHOW_EVENT',
    stages: [
      ...COMMON_START,
      'EVENT_PROSPECTUS_REVIEWED', 'EVENT_CONTACTED', 'EVENT_ACTIVATION_SUBMITTED',
      'EVENT_NEGOTIATION', 'EVENT_BOOKED', 'EVENT_PRE_EVENT', 'EVENT_DELIVERED',
      'EVENT_POST_EVENT_CONVERSION', 'EVENT_RECURRING_PARTNER',
      ...COMMON_MAINTENANCE,
    ],
    fields: [
      'name', 'priority', 'engagementHealth', 'owner', ...ENTITY_CARD_FIELDS, 'activityRecencyStatus',
      'proposedOffer', 'proposalReviewStatus', 'activationDate', 'activationStatus',
      'lastContactAt', 'nextActionAt', 'nextAction', 'campaign', 'followUpCount',
    ],
  },
};

const queueFields = [
  'name', 'partnerCategory', 'partnershipStage', 'priority', 'engagementHealth',
  'owner', ...ENTITY_CARD_FIELDS, 'responseStatus', 'lastContactAt', 'nextActionAt', 'nextAction',
  'campaign', 'followUpCount',
] as const;

const viewField = (viewKind: string, fieldName: string, position: number) => ({
  universalIdentifier: intakeUid(`view-field:partner-outreach:${viewKind}:${fieldName}`),
  fieldMetadataUniversalIdentifier: getIntakeFieldId('partner', fieldName),
  position,
  isVisible: true,
  size: fieldName === 'name' ? 260 : fieldName === 'nextAction' || fieldName === 'proposedOffer' ? 260 : 170,
});

const filter = (viewKind: string, fieldName: string, operand: ViewFilterOperand, value: string | string[]) => ({
  universalIdentifier: intakeUid(`view-filter:partner-outreach:${viewKind}:${fieldName}:${operand}`),
  fieldMetadataUniversalIdentifier: getIntakeFieldId('partner', fieldName),
  operand,
  value,
});

const sorts = (viewKind: string) => [
  {
    universalIdentifier: intakeUid(`view-sort:partner-outreach:${viewKind}:priority`),
    fieldMetadataUniversalIdentifier: getIntakeFieldId('partner', 'priority'),
    direction: ViewSortDirection.ASC,
  },
  {
    universalIdentifier: intakeUid(`view-sort:partner-outreach:${viewKind}:nextActionAt`),
    fieldMetadataUniversalIdentifier: getIntakeFieldId('partner', 'nextActionAt'),
    direction: ViewSortDirection.ASC,
  },
];

export const getPartnerBoardViewId = (kind: PartnerBoardKind): string =>
  intakeUid(`view:partnerLead:partnership-board:${kind}`);

export const buildPartnerBoardViewConfig = (kind: PartnerBoardKind): ViewConfig => {
  const definition = PARTNER_BOARD_DEFINITIONS[kind];
  return {
    universalIdentifier: getPartnerBoardViewId(kind),
    name: definition.name,
    objectUniversalIdentifier: getIntakeDefinition('partner').objectId,
    icon: definition.icon,
    type: ViewType.KANBAN,
    position: 10 + Object.keys(PARTNER_BOARD_DEFINITIONS).indexOf(kind),
    mainGroupByFieldMetadataUniversalIdentifier: getIntakeFieldId('partner', 'partnershipStage'),
    shouldHideEmptyGroups: false,
    kanbanColumnWidth: 320,
    fields: definition.fields.map((fieldName, position) => viewField(`board:${kind}`, fieldName, position)),
    filters: [
      filter(`board:${kind}`, 'captureStatus', ViewFilterOperand.IS_NOT, ['DRAFT']),
      filter(`board:${kind}`, 'partnerCategory', ViewFilterOperand.IS, [definition.category]),
    ],
    groups: definition.stages.map((stage, position) => ({
      universalIdentifier: intakeUid(`view-group:partner-outreach:${kind}:${stage}`),
      fieldValue: stage,
      isVisible: true,
      position,
    })),
    sorts: sorts(`board:${kind}`),
  } as ViewConfig;
};

type QueueDefinition = {
  name: string;
  icon: string;
  filters: ReturnType<typeof filter>[];
};

const queueDefinitions = (kind: PartnerQueueKind): QueueDefinition => {
  const activeOnly = filter(kind, 'captureStatus', ViewFilterOperand.IS_NOT, ['DRAFT']);
  const definitions: Record<PartnerQueueKind, QueueDefinition> = {
    'actions-due-now': {
      name: 'Partner Actions Due Today', icon: 'IconClock',
      filters: [activeOnly, filter(kind, 'nextActionAt', ViewFilterOperand.IS_TODAY, '')],
    },
    'overdue-follow-ups': {
      name: 'Partner Follow-ups — Overdue', icon: 'IconAlertTriangle',
      filters: [
        activeOnly,
        filter(kind, 'nextActionAt', ViewFilterOperand.IS_IN_PAST, ''),
        filter(kind, 'engagementHealth', ViewFilterOperand.IS_NOT, ['DECLINED', 'CONVERTED']),
      ],
    },
    'high-priority-uncontacted': {
      name: 'High-priority Partner Leads — Uncontacted', icon: 'IconFlame',
      filters: [
        activeOnly,
        filter(kind, 'priority', ViewFilterOperand.IS, ['HIGH']),
        filter(kind, 'responseStatus', ViewFilterOperand.IS, ['NOT_CONTACTED']),
      ],
    },
    'awaiting-response': {
      name: 'Partner Leads — Awaiting External Response', icon: 'IconMailForward',
      filters: [activeOnly, filter(kind, 'responseStatus', ViewFilterOperand.IS, ['AWAITING_RESPONSE'])],
    },
    'active-opportunities': {
      name: 'Active Partnership Opportunities', icon: 'IconTargetArrow',
      filters: [activeOnly, filter(kind, 'engagementHealth', ViewFilterOperand.IS, ['ACTIVE', 'AWAITING_RESPONSE'])],
    },
    'nurture-reengagement': {
      name: 'Partner Nurture & Re-engagement', icon: 'IconRefresh',
      filters: [activeOnly, filter(kind, 'engagementHealth', ViewFilterOperand.IS, ['NURTURE', 'STALE', 'PAUSED', 'NEEDS_VERIFICATION'])],
    },
    'converted-activations': {
      name: 'Converted Partners & Completed Activations', icon: 'IconRosetteDiscountCheck',
      filters: [activeOnly, filter(kind, 'engagementHealth', ViewFilterOperand.IS, ['CONVERTED'])],
    },
  };
  return definitions[kind];
};

export const getPartnerQueueViewId = (kind: PartnerQueueKind): string =>
  intakeUid(`view:partnerLead:partnership-queue:${kind}`);

export const buildPartnerQueueViewConfig = (kind: PartnerQueueKind): ViewConfig => {
  const definition = queueDefinitions(kind);
  return {
    universalIdentifier: getPartnerQueueViewId(kind),
    name: definition.name,
    objectUniversalIdentifier: getIntakeDefinition('partner').objectId,
    icon: definition.icon,
    type: ViewType.TABLE,
    position: 20 + [
      'actions-due-now', 'overdue-follow-ups', 'high-priority-uncontacted',
      'awaiting-response', 'active-opportunities', 'nurture-reengagement',
      'converted-activations',
    ].indexOf(kind),
    fields: queueFields.map((fieldName, position) => viewField(`queue:${kind}`, fieldName, position)),
    filters: definition.filters,
    sorts: sorts(`queue:${kind}`),
  } as ViewConfig;
};
