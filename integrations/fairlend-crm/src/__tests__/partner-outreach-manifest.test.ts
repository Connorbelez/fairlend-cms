import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

type OutreachRecord = {
  name: string;
  fairlendLeadId: string;
  partnerCategory: string;
  dossier: string;
  dossierSourcePaths: string[];
  outreachEmail: string;
  outreachLinkedIn: string;
  outreachPhoneAndForm: string;
  outreachFollowUps: string;
  outreachAsset: string;
  outreachGuardrails: string;
};

type OutreachManifest = {
  counts: Record<string, number>;
  records: OutreachRecord[];
  coverage: Record<string, number>;
};

const buildManifest = (): OutreachManifest => JSON.parse(execFileSync(
  process.execPath,
  [resolve(process.cwd(), 'scripts/build-partner-outreach-manifest.mjs')],
  { encoding: 'utf8' },
)) as OutreachManifest;

describe('partner personalized outreach manifest', () => {
  it('maps exactly one heading-bounded dossier to every researched Partner Lead', () => {
    const manifest = buildManifest();
    expect(manifest.records).toHaveLength(100);
    expect(manifest.counts).toEqual({
      TRADE_SHOW_EVENT: 20,
      PODCAST_MEDIA: 20,
      BUILDER_PROFESSIONAL: 20,
      INVESTOR_GROUP: 20,
      MEETUP_COMMUNITY: 20,
    });
    expect(new Set(manifest.records.map((record) => record.fairlendLeadId)).size).toBe(100);
    expect(Math.max(...manifest.records.map((record) => record.dossier.length))).toBeLessThan(8_000);
    expect(manifest.records.find((record) => record.name === 'Near North Landlords Association (NNLA)')?.dossier)
      .not.toContain('### M01');
  });

  it('preserves every multi-channel strategy and source reference', () => {
    const manifest = buildManifest();
    expect(manifest.coverage).toEqual({
      dossiers: 100,
      email: 100,
      linkedIn: 100,
      phoneOrForm: 100,
      followUps: 100,
      assets: 100,
      guardrails: 100,
    });
    for (const record of manifest.records) {
      expect(record.dossierSourcePaths).toContain(
        'docs/research/fairlend-personalized-multichannel-outreach-2026-07-15.md',
      );
    }
    expect(manifest.records.filter((record) => record.partnerCategory === 'PODCAST_MEDIA')
      .every((record) => record.dossierSourcePaths.includes(
        'docs/research/outreach-podcasts-personalized-2026-07-15.md',
      ))).toBe(true);
    expect(manifest.records.filter((record) => record.partnerCategory === 'TRADE_SHOW_EVENT')
      .every((record) => record.dossierSourcePaths.includes(
        'docs/research/outreach-events-personalized-2026-07-15.md',
      ))).toBe(true);
  });
});
