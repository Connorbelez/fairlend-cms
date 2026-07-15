import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

type Manifest = {
  counts: {
    leads: number;
    companyLinks: number;
    companyExceptions: number;
    uniqueCompanies: number;
    uniquePeople: number;
    decisionMakerLinks: number;
    primaryDecisionMakers: number;
  };
  leads: Array<{
    researchId: string;
    leadName: string;
    fairlendLeadId: string;
    partnerCategory: string;
    company: object | null;
    companyException: string;
    people: Array<{ fullName: string; identityKey: string; isPrimary: boolean }>;
  }>;
  companies: Array<{ matchKey: string }>;
  people: Array<{ identityKey: string; sourceUrls: string[] }>;
  decisionMakerLinks: Array<{ fairlendContactKey: string; sourceUrls: string[] }>;
};

const buildManifest = (): Manifest => JSON.parse(execFileSync(
  process.execPath,
  [resolve(process.cwd(), 'scripts/build-partner-entity-manifest.mjs')],
  { encoding: 'utf8' },
)) as Manifest;

describe('partner entity enrichment manifest', () => {
  it('reconciles all 100 researched leads and every documented entity exception', () => {
    const manifest = buildManifest();
    expect(manifest.counts).toMatchObject({
      leads: 100,
      companyLinks: 94,
      companyExceptions: 6,
      uniqueCompanies: 91,
      uniquePeople: 88,
      decisionMakerLinks: 97,
      primaryDecisionMakers: 50,
    });
    expect(manifest.leads.filter((lead) => lead.company || lead.companyException)).toHaveLength(100);
    expect(manifest.leads.filter((lead) => lead.company && lead.companyException)).toHaveLength(0);
    expect(new Set(manifest.leads.map((lead) => lead.researchId)).size).toBe(100);
    expect(new Set(manifest.leads.map((lead) => lead.fairlendLeadId)).size).toBe(100);
    expect(new Set(manifest.companies.map((company) => company.matchKey)).size).toBe(91);
    expect(new Set(manifest.people.map((person) => person.identityKey)).size).toBe(88);
    expect(new Set(manifest.decisionMakerLinks.map((link) => link.fairlendContactKey)).size).toBe(97);
    expect(manifest.people.every((person) => person.sourceUrls.length > 0)).toBe(true);
    expect(manifest.decisionMakerLinks.every((link) => link.sourceUrls.length > 0)).toBe(true);
  });

  it('preserves the exact five-category 20/20/20/20/20 corpus contract', () => {
    const manifest = buildManifest();
    const counts = manifest.leads.reduce<Record<string, number>>((result, lead) => {
      result[lead.partnerCategory] = (result[lead.partnerCategory] ?? 0) + 1;
      return result;
    }, {});
    expect(counts).toEqual({
      BUILDER_PROFESSIONAL: 20,
      PODCAST_MEDIA: 20,
      INVESTOR_GROUP: 20,
      MEETUP_COMMUNITY: 20,
      TRADE_SHOW_EVENT: 20,
    });
  });

  it('matches primary decision-makers by verified full-name aliases, never surname alone', () => {
    const manifest = buildManifest();
    const primaryFor = (researchId: string) => manifest.leads
      .find((lead) => lead.researchId === researchId)
      ?.people.find((person) => person.isPrimary)?.fullName;

    expect(primaryFor('B01')).toBe('Ryan Meagher');
    expect(primaryFor('B14')).toBe('Serafino “Sam” Meliambro');
    expect(primaryFor('M12')).toBe('Rhayan (Ryan) ElFakih');
  });
});
