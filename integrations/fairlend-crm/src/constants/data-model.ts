export const MORTGAGE_LEAD_OBJECT_ID = '1ac8b0c6-4041-4663-8454-6f782e7a060d';
export const MORTGAGE_LEAD_FIELD_IDS = {
  name: 'f56a3b9f-988d-4e69-9c8b-d7c3931130e8',
  fairlendLeadId: 'eca0f381-2118-4ac8-a758-1f61533d31e6',
  captureStatus: 'cb4af476-3956-4ddb-beaf-00e9bd519450',
  workflowStatus: '53c41e11-58e4-4701-bf78-1b6ca65e28c0',
  priority: '105cbff9-de32-4564-8d8c-34c353c2c8a6',
  nextActionAt: '3c2761aa-9bc1-4958-b18e-68e2787e3c51',
  intent: '9f7b3d11-731e-4662-90ae-9d9d36d81401',
  source: 'b0d93aa1-71e6-4df5-99bf-75388c49a334',
  campaign: 'd98c721e-bcb0-451d-982b-8d42ed113914',
  campaignScanId: 'e32745e7-fd2e-40f7-81b2-92697ecf0668',
  contactName: '481cbb9e-c441-44fa-a77d-412e7bfb8508',
  email: '85f99015-4262-49f0-bfc4-22be64a52375',
  phone: 'cc911201-8b79-412e-9a27-bdbc4cff1085',
  propertyAddress: 'ce4765b2-b2c6-482b-8abf-b93565eedb3c',
  formattedAddress: 'eccc38aa-f3e4-4841-ab79-d8f50fcf59e3',
  googlePlaceId: 'f38e088e-1ca5-4e66-8d18-4da925ac0cea',
  intakeType: 'f949e74e-232d-410c-9a70-a2b5e8ad8e77',
  requestedAmount: 'c751fd38-78a9-4a4b-adce-d52e4ea41ab0',
  timeline: 'f81fc1b0-3d0b-494e-b210-e4db03a6d6e5',
  projectStage: '24575aef-27fc-4ea3-8bce-13c101271fa4',
  mortgageProduct: 'b370f192-cc31-43ed-9266-a8504f06a8b8',
  mortgageGoal: '5124124b-414e-4061-b6bf-877c366b21ce',
  financingNeeds: '0fac1c60-09c3-4de5-b693-d4747ac65e5a',
  propertyValue: 'afab043a-656f-47ad-ba5c-885c54deb6fa',
  mortgageBalance: '2e63e5b7-1345-49a3-84eb-64456b39bca5',
  additionalLiens: 'e08dcada-b567-4c3d-82f3-b5d973328e87',
  investmentFocus: '24129795-253a-4495-a370-23d90b860e06',
  intakeSummary: 'd84db469-fe42-4824-b9e2-9145efd45e09',
  intakeDetail: '6454588c-6347-47ff-ac48-5dc4d5d1681b',
  intakePayload: '008e53ad-dcd8-4cb7-8f81-637f83d42351',
  addressPayload: '4224ef2a-e1c5-4080-9a51-dedffa47ffbe',
  attributionPayload: 'c0b3ef10-344e-4e0c-935a-56730b6871f6',
  adminNotes: '80a0d443-9711-4918-8303-f92c5b1691d6',
  person: '5a3c577e-7810-45f0-aeca-23266a035031',
  company: 'df316e16-f211-42c3-8fd4-c6112c06951a',
  opportunity: 'a45a76ac-5cf6-4571-b93c-56e3b2f0c269',
  consultations: 'bd30cfb8-fe78-4217-abec-94dfc8e5c0a8',
  campaignTouches: 'fa7bbf0e-0d63-49ae-a88c-2f06d229f903',
} as const;

export const STANDARD_OBJECT_RELATION_FIELD_IDS = {
  personMortgageLeads: 'aab07f11-a8ca-4833-8d7e-ff2a9c62d9ad',
  personConsultations: '5c47bd5c-6c47-4bf9-8f03-15f07e25d222',
  companyMortgageLeads: 'fa2fd184-1fe7-4203-82ec-14bca47343d6',
  opportunityMortgageLeads: '031ba404-36e7-4a50-ad82-b125c65c251e',
} as const;

export const CONSULTATION_OBJECT_ID = '51f4eb4a-f8bd-4b87-b147-5347da2297a5';
export const CONSULTATION_FIELD_IDS = {
  name: '00a7fbd2-bc9a-4ef0-8f25-3bb7bb565808',
  bookingId: '15b8912e-c54e-4f4b-9b50-ba6493550dd8',
  status: 'a5de7750-d31a-44bc-963d-86bcc7eff5cc',
  scheduledStart: 'e342ab69-0f31-4dab-8ad1-4614a7eb1808',
  scheduledEnd: 'd6d94deb-c993-4d95-999d-b87875cc8927',
  timezone: '9cfcdcea-06d3-41fd-ab63-0f05b98bd27e',
  contactName: '42ef6e04-f469-4e06-a717-1b215d8dac51',
  email: '5909a277-f826-4dba-893b-85bf2fe56df4',
  phone: 'ce3e11d5-e334-438f-afd4-937d7660b097',
  notes: 'd06c4392-84c1-4072-bd54-ef7d539a3c80',
  googleEventId: '08203233-5b8f-4093-bab1-5e79d4891c27',
  googleEventLink: 'fe3b496b-40a1-4999-ac28-9cd0b288a55c',
  syncError: 'a5d41a9e-9915-44c5-9a74-33720e419bfc',
  mortgageLead: 'e490a39c-f6e2-4f82-8de8-80db94aec80f',
  person: '75bad474-60f3-402b-9fe0-bb31218abd1a',
} as const;

export const CAMPAIGN_TOUCH_OBJECT_ID = '0afc4886-523d-49e6-9728-cc72816b8488';
export const CAMPAIGN_TOUCH_FIELD_IDS = {
  name: '947519d9-f576-405b-aaa4-c51001225e45',
  scanId: '3eb78e22-663f-4e7a-a94e-9a61a658e512',
  campaign: '61b96fbf-e940-47fd-bf48-6b2230440b59',
  source: '5f4c0d28-ee93-4bec-99ef-f164035e721e',
  destination: 'd45b7e5e-d593-4371-8f79-bcce32bfcaf8',
  referrer: 'f4bf1841-638e-415d-94c9-602dc0071e52',
  userAgent: 'fd319fe9-955d-4374-971a-2511cedf53b4',
  hashedIp: 'd52b5246-5adb-4b10-a36e-386a6cc0a338',
  queryParams: 'd38c168e-a1be-4295-8a36-e17bb7e50b88',
  capturedAt: 'ce5562ad-1231-47ae-9100-9e77334e92c3',
  convertedAt: 'e26c0d3d-3341-47df-a5ab-d400f555d58f',
  mortgageLead: '14c78cb5-d02e-4309-86b0-7a32a5b94457',
} as const;

export const VIEW_IDS = {
  mortgageLeads: '40d0cc81-450a-4e19-9e9d-dc243889a2a0',
  consultations: '731afee8-e5ae-40ac-b78d-327d130c7f55',
  campaignTouches: 'fcd69353-0f3a-4696-9b38-76192bab01b5',
} as const;

export const NAVIGATION_IDS = {
  mortgageLeads: '0a476897-4c02-454f-a930-acab43a89bb4',
  consultations: '21bd1cdf-5311-442d-a85d-d944364f4d1c',
  campaignTouches: '5af26190-8c7a-458b-98a7-d4ad602c3c0e',
} as const;
