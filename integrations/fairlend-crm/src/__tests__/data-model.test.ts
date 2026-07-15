import companyMortgageLeads from 'src/fields/company-mortgage-leads';
import companyFairlendConfidence from 'src/fields/company-fairlend-confidence';
import companyFairlendMatchKey from 'src/fields/company-fairlend-match-key';
import companyFairlendPrimaryContactRoute from 'src/fields/company-fairlend-primary-contact-route';
import companyFairlendResearchNotes from 'src/fields/company-fairlend-research-notes';
import companyFairlendSourceUrls from 'src/fields/company-fairlend-source-urls';
import companyFairlendVerifiedOn from 'src/fields/company-fairlend-verified-on';
import companyPartnerContactLinks from 'src/fields/company-partner-contact-links';
import opportunityMortgageLeads from 'src/fields/opportunity-mortgage-leads';
import personConsultations from 'src/fields/person-consultations';
import personMortgageLeads from 'src/fields/person-mortgage-leads';
import personFairlendConfidence from 'src/fields/person-fairlend-confidence';
import personFairlendIdentityKey from 'src/fields/person-fairlend-identity-key';
import personFairlendPrimaryContactRoute from 'src/fields/person-fairlend-primary-contact-route';
import personFairlendResearchNotes from 'src/fields/person-fairlend-research-notes';
import personFairlendSourceUrls from 'src/fields/person-fairlend-source-urls';
import personFairlendVerifiedOn from 'src/fields/person-fairlend-verified-on';
import personPartnerContactLinks from 'src/fields/person-partner-contact-links';
import workspaceMemberPartnerLeads from 'src/fields/workspace-member-partner-leads';
import { buildPartnerProspectUpserts } from 'src/imports/partner-prospect-enrichment';
import campaignTouchesNavigation from 'src/navigation-menu-items/campaign-touches.navigation-menu-item';
import consultationsNavigation from 'src/navigation-menu-items/consultations.navigation-menu-item';
import campaignTouch from 'src/objects/campaign-touch';
import consultation from 'src/objects/consultation';
import constructionApplication from 'src/objects/construction-application';
import generalInquiry from 'src/objects/general-inquiry';
import lenderApplication from 'src/objects/lender-application';
import mortgageBorrowerLead from 'src/objects/mortgage-borrower-lead';
import mortgageLead from 'src/objects/mortgage-lead';
import newsletterSubscription from 'src/objects/newsletter-subscription';
import partnerLead from 'src/objects/partner-lead';
import partnerContactEvidence from 'src/objects/partner-contact-evidence';
import {
  buildIntakeViewConfig,
  getAllPromotedFieldNames,
  type IntakeObjectKind,
} from 'src/schema/intake-model';
import {
  buildPartnerBoardViewConfig,
  buildPartnerQueueViewConfig,
  PARTNER_BOARD_DEFINITIONS,
  type PartnerBoardKind,
  type PartnerQueueKind,
} from 'src/schema/partner-outreach-model';
import campaignTouchesView from 'src/views/campaign-touches.view';
import consultationsView from 'src/views/consultations.view';
import mortgageLeadsView from 'src/views/mortgage-leads.view';
import partnerActionsDueNowView from 'src/views/partner-actions-due-now.view';
import partnerActiveOpportunitiesView from 'src/views/partner-active-opportunities.view';
import partnerAwaitingResponseView from 'src/views/partner-awaiting-response.view';
import partnerBuildersPipelineView from 'src/views/partner-builders-pipeline.view';
import partnerConvertedActivationsView from 'src/views/partner-converted-activations.view';
import partnerContactEvidenceView from 'src/views/partner-contact-evidence.view';
import partnerHighPriorityUncontactedView from 'src/views/partner-high-priority-uncontacted.view';
import partnerInvestorGroupsPipelineView from 'src/views/partner-investor-groups-pipeline.view';
import partnerMeetupsPipelineView from 'src/views/partner-meetups-pipeline.view';
import partnerNurtureReengagementView from 'src/views/partner-nurture-reengagement.view';
import partnerOverdueFollowUpsView from 'src/views/partner-overdue-follow-ups.view';
import partnerPodcastsPipelineView from 'src/views/partner-podcasts-pipeline.view';
import partnerTradeShowsPipelineView from 'src/views/partner-trade-shows-pipeline.view';
import { FieldType, RelationType } from 'twenty-sdk/define';
import { describe, expect, it } from 'vitest';

const operationalEntities = {
  mortgage: mortgageBorrowerLead,
  lender: lenderApplication,
  construction: constructionApplication,
  partner: partnerLead,
  consultation,
  general: generalInquiry,
  newsletter: newsletterSubscription,
} as const;
const entities = [mortgageLead, campaignTouch, partnerContactEvidence, ...Object.values(operationalEntities)];
const supportingEntities = [
  companyFairlendConfidence,
  companyFairlendMatchKey,
  companyFairlendPrimaryContactRoute,
  companyFairlendResearchNotes,
  companyFairlendSourceUrls,
  companyFairlendVerifiedOn,
  companyMortgageLeads,
  companyPartnerContactLinks,
  opportunityMortgageLeads,
  personConsultations,
  personFairlendConfidence,
  personFairlendIdentityKey,
  personFairlendPrimaryContactRoute,
  personFairlendResearchNotes,
  personFairlendSourceUrls,
  personFairlendVerifiedOn,
  personMortgageLeads,
  personPartnerContactLinks,
  workspaceMemberPartnerLeads,
  campaignTouchesView,
  consultationsView,
  mortgageLeadsView,
  campaignTouchesNavigation,
  consultationsNavigation,
  partnerBuildersPipelineView,
  partnerPodcastsPipelineView,
  partnerInvestorGroupsPipelineView,
  partnerMeetupsPipelineView,
  partnerTradeShowsPipelineView,
  partnerActionsDueNowView,
  partnerOverdueFollowUpsView,
  partnerHighPriorityUncontactedView,
  partnerAwaitingResponseView,
  partnerActiveOpportunitiesView,
  partnerNurtureReengagementView,
  partnerConvertedActivationsView,
  partnerContactEvidenceView,
];

describe('FairLend CRM data model', () => {
  it('validates every custom object definition', () => {
    for (const entity of entities) {
      expect(entity.success, entity.errors.join('\n')).toBe(true);
      expect(entity.errors).toEqual([]);
    }
  });

  it('validates inverse relations, views, and navigation definitions', () => {
    for (const entity of supportingEntities) {
      expect(entity.success, entity.errors.join('\n')).toBe(true);
      expect(entity.errors).toEqual([]);
    }
  });

  it('keeps all entity and field universal identifiers unique', () => {
    const identifiers = entities.flatMap((entity) => [
      entity.config.universalIdentifier,
      ...entity.config.fields.map((field) => field.universalIdentifier),
    ]);

    expect(new Set(identifiers).size).toBe(identifiers.length);
  });

  it('declares a physical join column for every many-to-one relation', () => {
    const relationFields = entities.flatMap((entity) =>
      entity.config.fields.filter((field) => field.type === FieldType.RELATION),
    );
    const manyToOneFields = relationFields.filter(
      (field) => field.universalSettings?.relationType === RelationType.MANY_TO_ONE,
    );

    expect(manyToOneFields.length).toBeGreaterThanOrEqual(21);

    for (const field of manyToOneFields) {
      expect(field.universalSettings?.joinColumnName, field.name).toMatch(/Id$/);
    }
  });

  it('quotes literal string defaults for Twenty metadata sync', () => {
    const stringDefaults = entities
      .flatMap((entity) => entity.config.fields)
      .filter(
        (field): field is typeof field & { defaultValue: string } =>
          'defaultValue' in field && typeof field.defaultValue === 'string',
      )
      .map((field) => field.defaultValue)
      .filter((defaultValue) => !['now', 'uuid'].includes(defaultValue));

    expect(stringDefaults.length).toBeGreaterThan(0);

    for (const defaultValue of stringDefaults) {
      expect(defaultValue).toMatch(/^'.*'$/);
    }
  });

  it('models the complete normalized website lead contract in typed columns', () => {
    for (const [kind, entity] of Object.entries(operationalEntities) as [IntakeObjectKind, typeof consultation][]) {
      const fieldNames = entity.config.fields.map((field) => field.name);
      expect(fieldNames).toEqual(expect.arrayContaining(getAllPromotedFieldNames(kind)));
      expect(fieldNames).toEqual(expect.arrayContaining(['capturedAt', 'submittedAt', 'timestampProvenance']));
    }
  });

  it('keeps raw audit JSON out of every user-facing All Intake Fields view', () => {
    for (const kind of Object.keys(operationalEntities) as IntakeObjectKind[]) {
      const view = buildIntakeViewConfig(kind, 'all-fields');
      const visibleIds = view.fields?.map((field) => field.fieldMetadataUniversalIdentifier) ?? [];
      const entity = operationalEntities[kind];
      const visibleNames = entity.config.fields
        .filter((field) => visibleIds.includes(field.universalIdentifier))
        .map((field) => field.name);
      expect(visibleNames).not.toEqual(expect.arrayContaining(['intakePayload', 'addressPayload', 'attributionPayload']));
      expect(visibleNames).toEqual(expect.arrayContaining(['capturedAt', 'submittedAt']));
    }
  });

  it('serializes intake SELECT view filters as option arrays', () => {
    for (const kind of Object.keys(operationalEntities) as IntakeObjectKind[]) {
      for (const viewKind of ['operations', 'drafts'] as const) {
        const view = buildIntakeViewConfig(kind, viewKind);

        for (const filter of view.filters ?? []) {
          expect(filter.value).toEqual(['DRAFT']);
        }
      }
    }
  });

  it('defines five category-specific partnership boards with distinct lifecycle contracts', () => {
    const boardKinds = Object.keys(PARTNER_BOARD_DEFINITIONS) as PartnerBoardKind[];
    expect(boardKinds).toHaveLength(5);

    const categories = new Set<string>();
    const lifecycleSignatures = new Set<string>();
    for (const kind of boardKinds) {
      const definition = PARTNER_BOARD_DEFINITIONS[kind];
      const view = buildPartnerBoardViewConfig(kind);
      categories.add(definition.category);
      lifecycleSignatures.add(definition.stages.join('|'));

      expect(view.type).toBe('KANBAN');
      expect(view.mainGroupByFieldMetadataUniversalIdentifier).toBe(
        partnerLead.config.fields.find((field) => field.name === 'partnershipStage')?.universalIdentifier,
      );
      expect(view.groups?.map((group) => group.fieldValue)).toEqual(definition.stages);
      expect(view.filters).toHaveLength(2);
      expect(view.sorts?.map((sort) => sort.direction)).toEqual(['ASC', 'ASC']);
      expect(view.fields?.length).toBeGreaterThanOrEqual(13);
      const visibleFieldIds = view.fields?.map((field) => field.fieldMetadataUniversalIdentifier) ?? [];
      for (const fieldName of ['company', 'person', 'decisionMakerCount', 'companyVerificationStatus', 'primaryDecisionMakerStatus']) {
        expect(visibleFieldIds).toContain(
          partnerLead.config.fields.find((field) => field.name === fieldName)?.universalIdentifier,
        );
      }
    }

    expect(categories.size).toBe(5);
    expect(lifecycleSignatures.size).toBeGreaterThanOrEqual(4);
  });

  it('defines every required operational partnership queue with typed filters and action-first sorting', () => {
    const queueKinds: PartnerQueueKind[] = [
      'actions-due-now', 'overdue-follow-ups', 'high-priority-uncontacted',
      'awaiting-response', 'active-opportunities', 'nurture-reengagement',
      'converted-activations',
    ];

    for (const kind of queueKinds) {
      const view = buildPartnerQueueViewConfig(kind);
      expect(view.type).toBe('TABLE');
      expect(view.filters?.length).toBeGreaterThanOrEqual(2);
      expect(view.sorts?.map((sort) => sort.direction)).toEqual(['ASC', 'ASC']);
      expect(view.fields?.map((field) => field.fieldMetadataUniversalIdentifier)).toContain(
        partnerLead.config.fields.find((field) => field.name === 'owner')?.universalIdentifier,
      );
      expect(view.fields?.map((field) => field.fieldMetadataUniversalIdentifier)).toEqual(expect.arrayContaining([
        partnerLead.config.fields.find((field) => field.name === 'company')?.universalIdentifier,
        partnerLead.config.fields.find((field) => field.name === 'person')?.universalIdentifier,
        partnerLead.config.fields.find((field) => field.name === 'decisionMakerCount')?.universalIdentifier,
      ]));
    }
  });

  it('keeps material partnership research and outreach intelligence in typed operational fields', () => {
    const fieldNames = partnerLead.config.fields.map((field) => field.name);
    expect(fieldNames).toEqual(expect.arrayContaining([
      'partnerCategory', 'partnershipStage', 'engagementHealth', 'responseStatus', 'owner',
      'lastContactAt', 'nextActionAt', 'nextAction', 'campaign', 'followUpCount',
      'primaryHook', 'fitEvidence', 'opennessSignal', 'contactRoute', 'sourceUrls',
      'verificationDate', 'proposedOffer', 'firstCta', 'objectionsAndRisks',
      'activityRecencyStatus', 'activityRecencyNotes', 'proposalReviewStatus',
      'activationType', 'activationStatus', 'activationDate', 'conversionOutcome',
      'reengageAt', 'pauseReason', 'declineReason', 'intakePayload',
      'company', 'person', 'decisionMakerLinks', 'decisionMakerCount',
      'companyVerificationStatus', 'primaryDecisionMakerStatus', 'companyMatchKey',
      'companySourceUrls', 'companyVerifiedOn', 'companyResearchNotes', 'peopleResearchSummary',
    ]));
  });

  it('models evidence-backed many-person partnership relationships without replacing the primary contact', () => {
    const partnerFieldNames = partnerLead.config.fields.map((field) => field.name);
    expect(partnerFieldNames).toEqual(expect.arrayContaining(['company', 'person', 'decisionMakerLinks']));

    const fieldNames = partnerContactEvidence.config.fields.map((field) => field.name);
    expect(fieldNames).toEqual(expect.arrayContaining([
      'fairlendContactKey', 'isPrimary', 'contactFunction', 'roleRelevance',
      'titleAtVerification', 'publicEmail', 'publicPhone', 'profileUrl',
      'primaryContactRoute', 'sourceUrls', 'verifiedOn', 'confidence',
      'verificationStatus', 'researchNotes', 'partnerLead', 'person', 'company',
    ]));
    expect(partnerContactEvidence.config.fields.find((field) => field.name === 'fairlendContactKey')).toMatchObject({
      isUnique: true,
      isUIEditable: false,
    });
    expect(partnerContactEvidence.config.fields.filter(
      (field) => field.type === FieldType.RELATION
        && field.universalSettings?.relationType === RelationType.MANY_TO_ONE,
    )).toHaveLength(3);
  });

  it('builds idempotent partnership upserts from stable UUIDv5 dossier records', () => {
    const records = buildPartnerProspectUpserts([
      {
        name: 'BVM Homes / BVM Contracting',
        fairlendLeadId: '5d015e2a-5a3e-5edb-8f65-98d574015e81',
        partnerType: 'Builder / early-file professional',
        priority: 'HIGH',
        intakePayload: {
          rank: 1,
          researchDate: '2026-07-15',
          masterResearchRow: {
            'First CTA': 'Select one anonymized file for a DrawFlow mapping.',
            'FairLend/DrawFlow Hook': 'Map an early construction budget into milestone releases.',
            'Fit Evidence': 'Sees drawings and budgets during pre-construction.',
            'Partner-Openness Signal': 'Maintains finance partners.',
            'Tailored Outreach Strategy': 'Run a consented three-file pilot.',
            'Public Contact Route': 'Business-development email',
            'Contact URL': 'https://example.com/contact',
            'Source URLs': 'https://example.com/about',
            Verified: '2026-07-15',
          },
          personalizedOutreachDossier: 'Risk: do not imply financing approval or exclusivity.',
          sourceDocuments: ['docs/research/fairlend-personalized-multichannel-outreach-2026-07-15.md'],
          personalizedOutreachChannels: {
            email: 'Subject: one anonymized file',
            linkedIn: 'Connection note',
            phoneAndForm: 'Phone opener',
            followUps: 'Day 7: send the map',
            asset: 'Budget-to-draw worksheet',
            guardrails: 'Do not imply approval.',
          },
        },
      },
    ], '5dcb0871-7dfe-4fb5-b81d-5c674a143551');

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      partnerCategory: 'BUILDER_PROFESSIONAL',
      partnershipStage: 'QUALIFIED',
      activationType: 'FILE_PILOT',
      ownerId: '5dcb0871-7dfe-4fb5-b81d-5c674a143551',
      nextActionAt: '2026-07-15T21:00:00.000Z',
    });
    expect(records[0].objectionsAndRisks).toContain('Risk:');
    expect(records[0]).toMatchObject({
      activationContext: 'Risk: do not imply financing approval or exclusivity.',
      outreachEmail: 'Subject: one anonymized file',
      outreachLinkedIn: 'Connection note',
      outreachPhoneAndForm: 'Phone opener',
      outreachFollowUps: 'Day 7: send the map',
      outreachAsset: 'Budget-to-draw worksheet',
      outreachGuardrails: 'Do not imply approval.',
      outreachDossierSources: 'docs/research/fairlend-personalized-multichannel-outreach-2026-07-15.md',
    });

    expect(() => buildPartnerProspectUpserts([
      {
        name: 'Duplicate one', fairlendLeadId: '5d015e2a-5a3e-5edb-8f65-98d574015e81',
        partnerType: 'Podcast', priority: 'NORMAL', intakePayload: {},
      },
      {
        name: 'Duplicate two', fairlendLeadId: '5d015e2a-5a3e-5edb-8f65-98d574015e81',
        partnerType: 'Meetup', priority: 'NORMAL', intakePayload: {},
      },
    ], '5dcb0871-7dfe-4fb5-b81d-5c674a143551')).toThrow(/Duplicate fairlendLeadId/);
  });
});
