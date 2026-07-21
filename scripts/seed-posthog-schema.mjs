import { PostHog } from 'posthog-node'

const projectKey = process.env.POSTHOG_PROJECT_KEY?.trim()
if (!projectKey) throw new Error('POSTHOG_PROJECT_KEY is required')

const events = [
  'fairlend_cta_clicked',
  'fairlend_route_selected',
  'fairlend_intake_started',
  'fairlend_intake_resumed',
  'fairlend_intake_step_viewed',
  'fairlend_intake_step_completed',
  'fairlend_intake_validation_failed',
  'fairlend_intake_back_clicked',
  'fairlend_intake_partial_submitted',
  'fairlend_lead_submitted',
  'fairlend_lead_submission_failed',
  'fairlend_consultation_scheduler_opened',
  'fairlend_phone_clicked',
  'fairlend_email_clicked',
  'fairlend_search_performed',
  'fairlend_resource_clicked',
  'fairlend_build_model_started',
  'fairlend_build_model_changed',
  'fairlend_build_model_cta_clicked',
  'fairlend_lead_qualified',
  'fairlend_lead_working_file',
  'fairlend_lead_closed_won',
  'fairlend_lead_closed_lost',
  'fairlend_consent_updated',
]

const posthog = new PostHog(projectKey, {
  flushAt: 20,
  flushInterval: 0,
  host: process.env.POSTHOG_HOST?.trim() || 'https://us.i.posthog.com',
})

for (const event of events) {
  posthog.capture({
    distinctId: 'fairlend-internal-schema-seed',
    event,
    properties: {
      $current_url: 'https://www.fairlend.ca/construction-financing',
      $internal_or_test_user: true,
      $insert_id: `fairlend-schema-v1-${event}`,
      analytics: true,
      completion_status: 'complete',
      content_group: 'conversion',
      cta_id: 'schema_seed',
      cta_location: 'internal_qa',
      deployment_environment: 'production',
      form_id: 'fairlend_schema_seed',
      input_category: 'project_costs',
      is_internal_user: true,
      journey_type: 'mortgage_private',
      marketing: false,
      page_path: '/construction-financing',
      page_type: 'intake',
      schema_version: 1,
      source: 'posthog_schema_seed',
      step_key: 'objective_transaction',
      step_number: 1,
      total_steps: 5,
    },
  })
}

await posthog.shutdown()
console.info(`Seeded ${events.length} internal PostHog schema events.`)
