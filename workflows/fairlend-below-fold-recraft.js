export const meta = {
  name: 'fairlend_below_fold_recraft',
  description:
    'Dynamic workflow: recraft Fairlend below-fold landing sections with /impeccable craft, shadcn MCP sourcing, and independent /impeccable audit loops.',
  phases: [
    { title: 'Copy manifest', model: 'codex' },
    { title: 'Craft direction', model: 'codex' },
    { title: 'Section recraft loops', model: 'codex' },
    { title: 'Final integration audit', model: 'codex' },
  ],
}

const input = args && typeof args === 'object' ? args : {}
const maxAuditRounds =
  Number.isFinite(Number(input.maxAuditRounds)) && Number(input.maxAuditRounds) > 0
    ? Math.floor(Number(input.maxAuditRounds))
    : 3
const includeFooter = Boolean(input.includeFooter)
const allowDevServer = Boolean(input.allowDevServer)
const route = typeof input.route === 'string' ? input.route : '/'

const defaultSections = [
  {
    id: 'client-signals',
    title: 'Client Signals testimonials',
    files: ['src/components/FairlendTestimonialsMarquee/index.tsx', 'src/components/testimonial.tsx'],
    intent:
      'Rebuild the testimonials/client proof section as a DrawFlow signal strip while preserving every testimonial quote, author, initials, and tagline exactly.',
  },
  {
    id: 'services',
    title: 'Our Services',
    files: ['src/components/FairlendServicesSection/index.tsx'],
    intent:
      'Rebuild the services section and service-detail interactions from scratch using shadcn/dashboard/bento primitives while preserving service titles, audiences, CTA labels, benefit bullets, outcomes, and how-it-works copy exactly.',
  },
  {
    id: 'opportunity-canvas',
    title: 'Opportunity canvas and bridge',
    files: ['src/components/FairlendOpportunityCanvas/index.tsx'],
    intent:
      'Rebuild the wrapper canvas and Signal to structure bridge so the testimonials-to-services transition feels like a calibrated instrument panel, preserving bridge labels and copy exactly.',
  },
  {
    id: 'judgment',
    title: 'About Fairlend / Judgment',
    files: ['src/components/FairlendJudgmentSection/index.tsx'],
    intent:
      'Rebuild the about/judgment section as an underwriting control surface while preserving headings, CTA, summary, proof labels, image alt text, IDs, and anchors exactly.',
  },
  {
    id: 'leadership',
    title: 'Leadership and proof',
    files: ['src/components/FairlendLeadershipSection/index.tsx'],
    intent:
      'Rebuild the leadership/proof section as a board-level evidence dashboard while preserving all metrics, quotes, names, roles, CTA labels, team labels, and proof text exactly.',
  },
]

const footerSection = {
  id: 'footer',
  title: 'Global footer',
  files: ['src/Footer/Component.tsx', 'src/Footer/WatermelonFooter.client.tsx'],
  intent:
    'Optionally rebuild the global footer only when requested, preserving all navigation, contact, disclosure, and newsletter copy exactly.',
}

const sections = Array.isArray(input.sections) && input.sections.length > 0
  ? input.sections
  : includeFooter
    ? [...defaultSections, footerSection]
    : defaultSections

const projectRules = [
  'Do not run tests, Playwright, E2E, or build for this marketing-page workflow.',
  'Do not create a dev server unless allowDevServer is true; if true, check for an existing server first.',
  'Do not touch the hero/header unless a section import contract absolutely requires it.',
  'Do not invent, rewrite, shorten, or embellish copy. Maintain copy exactly.',
  'Use DESIGN.md as the styling authority, even if older globals still expose prior Fairlend colors.',
]

const craftAnswers = {
  scope:
    'Re-create every below-fold Fairlend landing section after FairlendLandingHero on the frontend route.',
  audience:
    'Toronto builders, private mortgage borrowers, private mortgage investors, brokers, contractors, and referral partners.',
  purpose:
    'Convert high-stakes financing visitors by making FairLend feel rigorous, local, fast, and operationally trustworthy.',
  visualDirection:
    'DrawFlow Instrument Panel: light neutral chassis, nested frame panels, hairline borders, precise grids, sparse chartreuse signal, Oxanium/technical typography, operator-grade density, no generic fintech gloss.',
  constraints: projectRules,
  nonGoals: [
    'No hero redesign.',
    'No copywriting pass.',
    'No new claims, metrics, testimonials, or capabilities.',
    'No visual patterns that violate impeccable guidance: generic glassmorphism, gradient text, random blobs, floating SaaS cards, or decorative clutter.',
  ],
}

const implementationSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['implemented', 'blocked'] },
    changedFiles: { type: 'array', items: { type: 'string' } },
    shadcnSources: { type: 'array', items: { type: 'string' } },
    copyPreservationNotes: { type: 'array', items: { type: 'string' } },
    designSystemNotes: { type: 'array', items: { type: 'string' } },
    risks: { type: 'array', items: { type: 'string' } },
    blockers: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'status',
    'changedFiles',
    'shadcnSources',
    'copyPreservationNotes',
    'designSystemNotes',
    'risks',
    'blockers',
  ],
  additionalProperties: false,
}

const auditSchema = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['clear', 'revise', 'blocked'] },
    score0to4: { type: 'number' },
    priorityIssues: { type: 'array', items: { type: 'string' } },
    copyViolations: { type: 'array', items: { type: 'string' } },
    designViolations: { type: 'array', items: { type: 'string' } },
    shadcnViolations: { type: 'array', items: { type: 'string' } },
    accessibilityFindings: { type: 'array', items: { type: 'string' } },
    patchBrief: { type: 'array', items: { type: 'string' } },
    evidence: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'verdict',
    'score0to4',
    'priorityIssues',
    'copyViolations',
    'designViolations',
    'shadcnViolations',
    'accessibilityFindings',
    'patchBrief',
    'evidence',
  ],
  additionalProperties: false,
}

function sectionLabel(section) {
  return `${section.id}: ${section.title}`
}

function filesForPrompt(section) {
  return Array.isArray(section.files) ? section.files.join('\n- ') : String(section.files || '')
}

phase('Copy manifest')
const copyManifest = await agent(
  `Create a strict copy manifest for the Fairlend below-fold recraft workflow.\n\nRoute: ${route}\nSections:\n${sections
    .map((section) => `- ${sectionLabel(section)}\n  Files:\n  - ${filesForPrompt(section)}`)
    .join('\n')}\n\nInstructions:\n- Read the relevant files and extract user-facing copy by section.\n- Include headings, labels, CTA text, quotes, authors, roles, bullets, outcomes, step titles/details, image alt text, ARIA labels, IDs/anchors with semantic copy, and footer copy if included.\n- This manifest is the source of truth for later copy-preservation audits.\n- Do not rewrite copy.`,
  {
    label: 'copy manifest',
    model: 'codex',
    schema: {
      type: 'object',
      properties: {
        sections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              files: { type: 'array', items: { type: 'string' } },
              copyItems: { type: 'array', items: { type: 'string' } },
              selectorsOrAnchors: { type: 'array', items: { type: 'string' } },
            },
            required: ['id', 'title', 'files', 'copyItems', 'selectorsOrAnchors'],
            additionalProperties: false,
          },
        },
      },
      required: ['sections'],
      additionalProperties: false,
    },
  },
)

phase('Craft direction')
const direction = await agent(
  `Run the local skill as /impeccable craft for this request, but answer discovery/shape questions yourself from the supplied request, DESIGN.md, and current code.\n\nDo not stop for user confirmation; the user explicitly said to answer the questions and DESIGN.md is already made. Produce the compact confirmed direction that implementation agents must follow.\n\nAnswered craft questions:\n${JSON.stringify(craftAnswers, null, 2)}\n\nRequired design source: DESIGN.md.\nRequired shadcn sourcing: for each section, use the shadcn MCP first to search/select premade blocks or sections. Preference order: @aceternity, @watermelon, then installed shadcn/ui or existing registry assets. If MCP or a preferred registry is unavailable, document the fallback and use the closest local shadcn/registry primitive.\n\nReturn a concise direction and per-section build strategy.`,
  {
    label: 'impeccable craft direction',
    model: 'codex',
    schema: {
      type: 'object',
      properties: {
        direction: { type: 'string' },
        designRules: { type: 'array', items: { type: 'string' } },
        shadcnSourcingRules: { type: 'array', items: { type: 'string' } },
        sectionStrategies: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              strategy: { type: 'string' },
              likelyBlocks: { type: 'array', items: { type: 'string' } },
            },
            required: ['id', 'strategy', 'likelyBlocks'],
            additionalProperties: false,
          },
        },
        risks: { type: 'array', items: { type: 'string' } },
      },
      required: ['direction', 'designRules', 'shadcnSourcingRules', 'sectionStrategies', 'risks'],
      additionalProperties: false,
    },
  },
)

const sectionResults = []

for (const section of sections) {
  phase(`Recraft: ${section.title}`)

  let implementation = await agent(
    `Use /impeccable craft implementation mode to completely re-create this below-fold section from scratch.\n\nSection: ${sectionLabel(section)}\nIntent: ${section.intent || 'Rebuild the section from scratch while preserving copy.'}\nFiles to modify/read:\n- ${filesForPrompt(section)}\nRoute: ${route}\n\nCraft direction:\n${JSON.stringify(direction, null, 2)}\n\nCopy manifest:\n${JSON.stringify(copyManifest, null, 2)}\n\nHard requirements:\n${projectRules.map((rule) => `- ${rule}`).join('\n')}\n- Start by using the shadcn MCP to source premade blocks/sections, preferring @aceternity then @watermelon. Adapt them to the section instead of hand-building first.\n- Style imported shadcn components/blocks to DESIGN.md: frame chassis, frame panels, hairline borders, no theatrical shadows, sparse chartreuse primary, operator-grade density, technical typography.\n- Preserve public exports and page imports unless you update all call sites.\n- Keep semantic anchors/test IDs where practical so existing navigation and QA hooks survive.\n- This must be a structural recraft, not a class-name polish pass.\n\nValidation: do not run tests/build/playwright. Use file inspection and static reasoning only.`,
    {
      label: `${section.id} implementation`,
      model: 'codex',
      schema: implementationSchema,
    },
  )

  const audits = []
  let cleared = false

  for (let round = 1; round <= maxAuditRounds; round += 1) {
    phase(`Audit: ${section.title} round ${round}`)
    const audit = await agent(
      `Run an independent read-only /impeccable audit for the just-recrafted section. Do not edit files.\n\nSection: ${sectionLabel(section)}\nFiles:\n- ${filesForPrompt(section)}\nRoute: ${route}\nallowDevServer: ${allowDevServer}\n\nImplementation report:\n${JSON.stringify(implementation, null, 2)}\n\nCraft direction:\n${JSON.stringify(direction, null, 2)}\n\nCopy manifest:\n${JSON.stringify(copyManifest, null, 2)}\n\nAudit rubric:\n- Verdict is clear only if copy is preserved exactly, the component was meaningfully recreated, imported shadcn blocks/components are styled to DESIGN.md, accessibility/semantics are sound, and no impeccable AI-slop patterns are introduced.\n- Prefer concrete file/selector evidence.\n- If allowDevServer is false, do not start a server; use source inspection. If true, check whether a dev server is already running before starting one.\n- Do not run tests, Playwright, E2E, or build.`,
      {
        label: `${section.id} audit r${round}`,
        model: 'codex',
        schema: auditSchema,
      },
    )

    audits.push(audit)

    if (audit.verdict === 'clear') {
      cleared = true
      break
    }

    if (audit.verdict === 'blocked' || round === maxAuditRounds) {
      sectionResults.push({ section, implementation, audits, status: 'blocked' })
      return {
        status: 'blocked',
        blockedSection: sectionLabel(section),
        reason:
          audit.verdict === 'blocked'
            ? 'Audit agent reported blocked.'
            : `Section did not clear after ${maxAuditRounds} audit rounds.`,
        copyManifest,
        direction,
        sectionResults,
      }
    }

    phase(`Patch: ${section.title} round ${round}`)
    implementation = await agent(
      `Respond to the independent /impeccable audit feedback and patch the section until it clears.\n\nSection: ${sectionLabel(section)}\nFiles:\n- ${filesForPrompt(section)}\n\nLatest audit:\n${JSON.stringify(audit, null, 2)}\n\nPrevious implementation report:\n${JSON.stringify(implementation, null, 2)}\n\nHard requirements remain unchanged:\n${projectRules.map((rule) => `- ${rule}`).join('\n')}\n- Preserve copy exactly from the manifest.\n- Keep the recraft aligned with DESIGN.md.\n- Prefer fixing root design/system issues over superficial class tweaks.\n- Do not run tests/build/playwright.`,
      {
        label: `${section.id} patch r${round}`,
        model: 'codex',
        schema: implementationSchema,
      },
    )
  }

  sectionResults.push({ section, implementation, audits, status: cleared ? 'clear' : 'blocked' })
}

phase('Final integration audit')
let finalAudit = await agent(
  `Run a final independent /impeccable audit across the below-fold landing page after all section loops cleared. Do not edit files.\n\nRoute: ${route}\nSections:\n${sections.map((section) => `- ${sectionLabel(section)}`).join('\n')}\n\nSection results:\n${JSON.stringify(sectionResults, null, 2)}\n\nCraft direction:\n${JSON.stringify(direction, null, 2)}\n\nCopy manifest:\n${JSON.stringify(copyManifest, null, 2)}\n\nRubric:\n- Overall narrative sequence after the hero is cohesive.\n- All section copy is preserved exactly.\n- shadcn/registry components do not look pasted in; they obey DESIGN.md.\n- No visual conflict between sections; transitions feel intentional.\n- No tests/build/playwright. If allowDevServer is true, check for an existing server before any browser work.`,
  {
    label: 'final below-fold audit',
    model: 'codex',
    schema: auditSchema,
  },
)

if (finalAudit.verdict === 'revise') {
  phase('Final integration patch')
  const finalPatch = await agent(
    `Apply only the final integration audit patch notes. Do not reopen already clear section concepts unless needed for cross-section consistency.\n\nFinal audit:\n${JSON.stringify(finalAudit, null, 2)}\n\nSections and files:\n${sections.map((section) => `- ${sectionLabel(section)}: ${filesForPrompt(section)}`).join('\n')}\n\nHard requirements:\n${projectRules.map((rule) => `- ${rule}`).join('\n')}`,
    {
      label: 'final integration patch',
      model: 'codex',
      schema: implementationSchema,
    },
  )

  phase('Final integration re-audit')
  finalAudit = await agent(
    `Re-run the independent read-only /impeccable audit after the final integration patch. Return clear only if all gates pass.\n\nFinal patch report:\n${JSON.stringify(finalPatch, null, 2)}\n\nCopy manifest:\n${JSON.stringify(copyManifest, null, 2)}\n\nDesign direction:\n${JSON.stringify(direction, null, 2)}`,
    {
      label: 'final below-fold re-audit',
      model: 'codex',
      schema: auditSchema,
    },
  )

  return {
    status: finalAudit.verdict === 'clear' ? 'passed' : 'needs_revision',
    copyManifest,
    direction,
    sectionResults,
    finalPatch,
    finalAudit,
  }
}

return {
  status: finalAudit.verdict === 'clear' ? 'passed' : 'needs_revision',
  copyManifest,
  direction,
  sectionResults,
  finalAudit,
}
