export const meta = {
  name: 'landing_copy_multi_pass',
  description:
    'Multi-pass landing page copy review: Codex clarifies and evaluates conversion psychology, Kimi rewrites, Codex QA patches',
  phases: [
    { title: 'Clarify', model: 'codex' },
    { title: 'Evaluate', model: 'codex' },
    { title: 'Rewrite', model: 'kimi' },
    { title: 'QA', model: 'codex' },
    { title: 'Patch', model: 'kimi' },
  ],
}

const input = args && typeof args === 'object' ? args : {}
const copy = typeof input.copy === 'string' ? input.copy : ''
const audience = typeof input.audience === 'string' ? input.audience : 'target customer'
const offer = typeof input.offer === 'string' ? input.offer : 'landing page offer'
const tone = typeof input.tone === 'string' ? input.tone : 'clear, credible, conversion-focused'
const constraints =
  typeof input.constraints === 'string'
    ? input.constraints
    : 'Keep claims accurate. Do not invent proof, metrics, testimonials, guarantees, or capabilities.'

phase('Clarify')
const clarify = await agent(
  'Run an /impeccable clarify-style pass for landing page copy. Clarify core message before rewriting. Identify audience, job-to-be-done, promise, proof needed, objections, desired action, missing context, and brand/tone constraints. If info is missing, make conservative assumptions and label them.\n\nAudience: ' +
    audience +
    '\nOffer: ' +
    offer +
    '\nTone: ' +
    tone +
    '\nConstraints: ' +
    constraints +
    '\n\nCOPY:\n' +
    copy,
  {
    label: 'clarify pass',
    model: 'codex',
    schema: {
      type: 'object',
      properties: {
        coreMessage: { type: 'string' },
        audienceJTBD: { type: 'string' },
        primaryPromise: { type: 'string' },
        conversionGoal: { type: 'string' },
        proofNeeded: { type: 'array', items: { type: 'string' } },
        objections: { type: 'array', items: { type: 'string' } },
        assumptions: { type: 'array', items: { type: 'string' } },
      },
      required: [
        'coreMessage',
        'audienceJTBD',
        'primaryPromise',
        'conversionGoal',
        'proofNeeded',
        'objections',
        'assumptions',
      ],
      additionalProperties: false,
    },
  },
)

phase('Evaluate')
const evaluations = await parallel([
  () =>
    agent(
      'Evaluate landing page copy using conversion psychology. Use AIDA, PAS, awareness ladder, motivation/friction/anxiety, specificity, cognitive fluency, trust/proof, loss aversion, urgency, and CTA scent. Return ranked issues and rewrite directives.\n\nClarified strategy:\n' +
        JSON.stringify(clarify) +
        '\n\nCOPY:\n' +
        copy,
      {
        label: 'psych audit',
        model: 'codex',
        schema: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            rankedIssues: { type: 'array', items: { type: 'string' } },
            directives: { type: 'array', items: { type: 'string' } },
          },
          required: ['score', 'rankedIssues', 'directives'],
          additionalProperties: false,
        },
      },
    ),
  () =>
    agent(
      'Evaluate landing page copy as conversion strategist. Focus on positioning, offer clarity, section sequence, objections, credibility gaps, CTA intent, and page narrative. Return concise diagnosis and rewrite brief.\n\nClarified strategy:\n' +
        JSON.stringify(clarify) +
        '\n\nCOPY:\n' +
        copy,
      {
        label: 'strategy audit',
        model: 'codex',
        schema: {
          type: 'object',
          properties: {
            diagnosis: { type: 'string' },
            topIssues: { type: 'array', items: { type: 'string' } },
            rewriteBrief: { type: 'string' },
            mustKeep: { type: 'array', items: { type: 'string' } },
          },
          required: ['diagnosis', 'topIssues', 'rewriteBrief', 'mustKeep'],
          additionalProperties: false,
        },
      },
    ),
])

const psych = evaluations[0]
const strategy = evaluations[1]

phase('Rewrite')
const rewrite = await agent(
  'You are Kimi acting as senior direct-response landing page copywriter. Rewrite copy using clarified strategy, psychology audit, and strategy audit. Keep claims accurate. Improve hook, specificity, proof requests, objections, CTA scent, rhythm, and section flow. Output polished landing page copy with section headings.\n\nAudience: ' +
    audience +
    '\nOffer: ' +
    offer +
    '\nTone: ' +
    tone +
    '\nConstraints: ' +
    constraints +
    '\n\nClarify pass:\n' +
    JSON.stringify(clarify) +
    '\n\nPsychology audit:\n' +
    JSON.stringify(psych) +
    '\n\nStrategy audit:\n' +
    JSON.stringify(strategy) +
    '\n\nOriginal copy:\n' +
    copy,
  {
    label: 'kimi rewrite',
    model: 'kimi',
    schema: {
      type: 'object',
      properties: {
        headline: { type: 'string' },
        subheadline: { type: 'string' },
        sections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              heading: { type: 'string' },
              body: { type: 'string' },
            },
            required: ['heading', 'body'],
            additionalProperties: false,
          },
        },
        cta: { type: 'string' },
      },
      required: ['headline', 'subheadline', 'sections', 'cta'],
      additionalProperties: false,
    },
  },
)

phase('QA')
const qa = await agent(
  'You are Codex acting as editor-in-chief and conversion QA. Check Kimi rewrite against original, clarify pass, psychology audit, and strategy audit. Flag invented claims, weak psychology, missing objections/proof, unclear CTA, tone drift, or conversion gaps. Return verdict and exact patch notes.\n\nOriginal copy:\n' +
    copy +
    '\n\nClarify:\n' +
    JSON.stringify(clarify) +
    '\n\nPsychology audit:\n' +
    JSON.stringify(psych) +
    '\n\nStrategy audit:\n' +
    JSON.stringify(strategy) +
    '\n\nRewrite:\n' +
    JSON.stringify(rewrite),
  {
    label: 'codex qa',
    model: 'codex',
    schema: {
      type: 'object',
      properties: {
        verdict: { type: 'string', enum: ['ship', 'revise'] },
        notes: { type: 'array', items: { type: 'string' } },
      },
      required: ['verdict', 'notes'],
      additionalProperties: false,
    },
  },
)

if (qa.verdict === 'revise') {
  phase('Patch')
  return {
    clarify,
    psych,
    strategy,
    rewrite,
    qa,
    finalCopy: await agent(
      'You are Kimi. Apply Codex QA patch notes to landing page copy. Preserve strengths. Do not add invented proof or claims. Return final polished landing page copy.\n\nQA notes:\n' +
        qa.notes.join('\n') +
        '\n\nCurrent rewrite:\n' +
        JSON.stringify(rewrite),
      {
        label: 'kimi patch',
        model: 'kimi',
        schema: {
          type: 'object',
          properties: {
            headline: { type: 'string' },
            subheadline: { type: 'string' },
            sections: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  heading: { type: 'string' },
                  body: { type: 'string' },
                },
                required: ['heading', 'body'],
                additionalProperties: false,
              },
            },
            cta: { type: 'string' },
          },
          required: ['headline', 'subheadline', 'sections', 'cta'],
          additionalProperties: false,
        },
      },
    ),
  }
}

return { clarify, psych, strategy, rewrite, qa, finalCopy: rewrite }
