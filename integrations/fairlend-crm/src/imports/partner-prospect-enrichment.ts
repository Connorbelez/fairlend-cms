export type LegacyPartnerProspect = {
  name: string;
  fairlendLeadId: string;
  partnerType: string;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  intakePayload: {
    rank?: number | string;
    researchDate?: string;
    masterResearchRow?: Record<string, string>;
    personalizedOutreachDossier?: string;
  };
};

const categoryByLegacyType = {
  'Builder / early-file professional': 'BUILDER_PROFESSIONAL',
  Podcast: 'PODCAST_MEDIA',
  'Investor group': 'INVESTOR_GROUP',
  Meetup: 'MEETUP_COMMUNITY',
  'Trade show / event': 'TRADE_SHOW_EVENT',
} as const;

const activationByCategory = {
  BUILDER_PROFESSIONAL: 'FILE_PILOT',
  PODCAST_MEDIA: 'EDITORIAL_EPISODE',
  INVESTOR_GROUP: 'MEMBER_PROGRAM',
  MEETUP_COMMUNITY: 'MEETUP_SESSION',
  TRADE_SHOW_EVENT: 'EVENT_ACTIVATION',
  OTHER: 'NONE',
} as const;

const linesMatching = (value: string, pattern: RegExp, limit: number): string =>
  value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && pattern.test(line))
    .join('\n')
    .slice(0, limit);

const nextActionAtForRank = (rank: number): string => {
  const day = rank <= 4 ? '15' : rank <= 8 ? '16' : rank <= 12 ? '17' : rank <= 16 ? '20' : '22';
  return `2026-07-${day}T21:00:00.000Z`;
};

const activityStatusFromDossier = (dossier: string): 'CURRENT' | 'VERIFY_BEFORE_OUTREACH' | 'POSSIBLY_PAUSED' | 'STALE' => {
  if (/stale/i.test(dossier)) return 'STALE';
  if (/possibly paused|appears paused|may be paused|podcast paused|inactive feed/i.test(dossier)) return 'POSSIBLY_PAUSED';
  if (/verification hold|verify before|reverify|unverified|confirm (?:activity|date|status)|validate 2027|risk:.*validat/i.test(dossier)) {
    return 'VERIFY_BEFORE_OUTREACH';
  }
  return 'CURRENT';
};

export const buildPartnerProspectUpserts = (records: LegacyPartnerProspect[], ownerId: string) => {
  const stableIds = records.map((record) => record.fairlendLeadId);
  if (stableIds.some((id) => !/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))) {
    throw new Error('Every partnership prospect must use a stable UUIDv5 fairlendLeadId.');
  }
  if (new Set(stableIds).size !== stableIds.length) {
    throw new Error('Duplicate fairlendLeadId values would make the partnership import ambiguous.');
  }

  return records.map((record) => {
    const payload = record.intakePayload;
    const research = payload.masterResearchRow ?? {};
    const dossier = payload.personalizedOutreachDossier ?? '';
    const rank = Number(payload.rank) || 20;
    const partnerCategory = categoryByLegacyType[record.partnerType as keyof typeof categoryByLegacyType] ?? 'OTHER';
    const activityRecencyStatus = activityStatusFromDossier(dossier);
    const verificationDate = String(research.Verified ?? payload.researchDate ?? '2026-07-15').slice(0, 10);

    return {
      name: record.name,
      fairlendLeadId: record.fairlendLeadId,
      captureStatus: 'STARTED',
      workflowStatus: 'QUALIFIED',
      priority: record.priority,
      timestampProvenance: 'NOT_SUBMITTED',
      consultationMilestone: 'NONE',
      position: rank,
      partnerCategory,
      partnershipStage: 'QUALIFIED',
      engagementHealth: activityRecencyStatus === 'CURRENT' ? 'ACTIVE' : 'NEEDS_VERIFICATION',
      responseStatus: 'NOT_CONTACTED',
      lastContactChannel: 'NONE',
      proposalReviewStatus: 'READY_TO_SUBMIT',
      activationType: activationByCategory[partnerCategory],
      activationStatus: 'NOT_PROPOSED',
      activityRecencyStatus,
      ownerId,
      followUpCount: 0,
      nextActionAt: nextActionAtForRank(rank),
      nextAction: research['First CTA'] ?? '',
      primaryHook: research['FairLend/DrawFlow Hook'] ?? '',
      fitEvidence: research['Fit Evidence'] ?? '',
      opennessSignal: research['Partner-Openness Signal'] ?? '',
      contactRoute: [research['Public Contact Route'], research['Contact URL']].filter(Boolean).join('\n'),
      sourceUrls: research['Source URLs'] ?? research['Contact URL'] ?? '',
      verificationDate,
      proposedOffer: research['Tailored Outreach Strategy'] ?? '',
      firstCta: research['First CTA'] ?? '',
      objectionsAndRisks: linesMatching(
        dossier,
        /(risk|claim|avoid|limit|boundary|guardrail|guarantee|compliance|consent|endorsement|exclusive|no [a-z-]+ advice)/i,
        5_000,
      ) || 'Use consent-based, non-exclusive outreach; do not imply approval, guaranteed financing, or partner endorsement.',
      activityRecencyNotes: linesMatching(
        dossier,
        /(recent|current|active|paused|stale|verify|reverify|dated|episode|event|202[4-7])/i,
        3_500,
      ) || `Research verified ${verificationDate}; recheck public activity before outreach.`,
      activationContext: dossier.slice(0, 12_000),
    } as const;
  });
};
