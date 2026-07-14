import companyMortgageLeads from 'src/fields/company-mortgage-leads';
import opportunityMortgageLeads from 'src/fields/opportunity-mortgage-leads';
import personConsultations from 'src/fields/person-consultations';
import personMortgageLeads from 'src/fields/person-mortgage-leads';
import campaignTouchesNavigation from 'src/navigation-menu-items/campaign-touches.navigation-menu-item';
import consultationsNavigation from 'src/navigation-menu-items/consultations.navigation-menu-item';
import mortgageLeadsNavigation from 'src/navigation-menu-items/mortgage-leads.navigation-menu-item';
import campaignTouch from 'src/objects/campaign-touch';
import consultation from 'src/objects/consultation';
import mortgageLead from 'src/objects/mortgage-lead';
import campaignTouchesView from 'src/views/campaign-touches.view';
import consultationsView from 'src/views/consultations.view';
import mortgageLeadsView from 'src/views/mortgage-leads.view';
import { FieldType, RelationType } from 'twenty-sdk/define';
import { describe, expect, it } from 'vitest';

const entities = [mortgageLead, consultation, campaignTouch];
const supportingEntities = [
  companyMortgageLeads,
  opportunityMortgageLeads,
  personConsultations,
  personMortgageLeads,
  campaignTouchesView,
  consultationsView,
  mortgageLeadsView,
  campaignTouchesNavigation,
  consultationsNavigation,
  mortgageLeadsNavigation,
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

    expect(manyToOneFields).toHaveLength(6);

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

  it('models the complete normalized website lead contract', () => {
    const fieldNames = mortgageLead.config.fields.map((field) => field.name);

    expect(fieldNames).toEqual(
      expect.arrayContaining([
        'fairlendLeadId',
        'captureStatus',
        'workflowStatus',
        'priority',
        'intent',
        'source',
        'campaign',
        'campaignScanId',
        'contactName',
        'email',
        'phone',
        'propertyAddress',
        'intakeType',
        'requestedAmount',
        'timeline',
        'projectStage',
        'mortgageProduct',
        'mortgageGoal',
        'financingNeeds',
        'propertyValue',
        'mortgageBalance',
        'additionalLiens',
        'investmentFocus',
        'intakeSummary',
        'intakeDetail',
        'intakePayload',
        'addressPayload',
        'attributionPayload',
        'person',
        'company',
        'opportunity',
      ]),
    );
  });
});
