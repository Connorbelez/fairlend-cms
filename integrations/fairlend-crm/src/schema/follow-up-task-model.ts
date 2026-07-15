import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { intakeUid } from 'src/schema/intake-model';

type FieldConfig = Parameters<typeof defineField>[0];

export type FollowUpTaskField =
  | 'fairlendTaskKey'
  | 'followUpMethod'
  | 'followUpOutcome'
  | 'followUpRequirements'
  | 'followUpSequenceStep';

export const FOLLOW_UP_TASK_FIELD_IDS = {
  fairlendTaskKey: intakeUid('field:task:fairlendTaskKey'),
  followUpMethod: intakeUid('field:task:followUpMethod'),
  followUpOutcome: intakeUid('field:task:followUpOutcome'),
  followUpRequirements: intakeUid('field:task:followUpRequirements'),
  followUpSequenceStep: intakeUid('field:task:followUpSequenceStep'),
  fairlendTaskTargetKey: intakeUid('field:taskTarget:fairlendTaskTargetKey'),
} as const;

export const FOLLOW_UP_METHOD_OPTIONS = [
  { value: 'EMAIL', label: 'Email', position: 0, color: 'blue' as const },
  { value: 'LINKEDIN', label: 'LinkedIn', position: 1, color: 'purple' as const },
  { value: 'PHONE', label: 'Phone', position: 2, color: 'green' as const },
  { value: 'CONTACT_FORM', label: 'Contact Form', position: 3, color: 'yellow' as const },
  { value: 'MEETING', label: 'Meeting', position: 4, color: 'orange' as const },
  { value: 'RESEARCH', label: 'Research / Verification', position: 5, color: 'crimson' as const },
  { value: 'OTHER', label: 'Other', position: 6, color: 'gray' as const },
] as const;

export const FOLLOW_UP_OUTCOME_OPTIONS = [
  { value: 'PENDING', label: 'Pending', position: 0, color: 'gray' as const },
  { value: 'POSITIVE_RESPONSE', label: 'Positive Response', position: 1, color: 'green' as const },
  { value: 'NEUTRAL_RESPONSE', label: 'Neutral Response', position: 2, color: 'blue' as const },
  { value: 'NEGATIVE_RESPONSE', label: 'Negative Response', position: 3, color: 'red' as const },
  { value: 'NO_RESPONSE', label: 'No Response', position: 4, color: 'orange' as const },
  { value: 'WRONG_CONTACT', label: 'Wrong Contact', position: 5, color: 'yellow' as const },
  { value: 'INFORMATION_RECEIVED', label: 'Information Received', position: 6, color: 'purple' as const },
  { value: 'MEETING_BOOKED', label: 'Meeting Booked', position: 7, color: 'green' as const },
  { value: 'DO_NOT_CONTACT', label: 'Do Not Contact', position: 8, color: 'red' as const },
  { value: 'COMPLETED_OTHER', label: 'Completed — Other', position: 9, color: 'gray' as const },
] as const;

export const buildFollowUpTaskFieldConfig = (field: FollowUpTaskField): FieldConfig => {
  const common = {
    universalIdentifier: FOLLOW_UP_TASK_FIELD_IDS[field],
    objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier,
    isNullable: true,
  };

  if (field === 'fairlendTaskKey') {
    return {
      ...common,
      type: FieldType.TEXT,
      name: field,
      label: 'FairLend Task Key',
      description: 'Stable cross-system idempotency key for a generated Follow-up Action.',
      isUnique: true,
      isUIEditable: false,
    } as FieldConfig;
  }

  if (field === 'followUpMethod') {
    return {
      ...common,
      type: FieldType.SELECT,
      name: field,
      label: 'Follow-up Method',
      isNullable: false,
      defaultValue: "'OTHER'",
      options: [...FOLLOW_UP_METHOD_OPTIONS],
    } as FieldConfig;
  }

  if (field === 'followUpOutcome') {
    return {
      ...common,
      type: FieldType.SELECT,
      name: field,
      label: 'Follow-up Outcome',
      isNullable: false,
      defaultValue: "'PENDING'",
      options: [...FOLLOW_UP_OUTCOME_OPTIONS],
    } as FieldConfig;
  }

  if (field === 'followUpSequenceStep') {
    return {
      ...common,
      type: FieldType.NUMBER,
      name: field,
      label: 'Follow-up Sequence Step',
      description: 'One-based position of this Follow-up Action in the lead-specific sequence.',
    } as FieldConfig;
  }

  return {
    ...common,
    type: FieldType.TEXT,
    name: field,
    label: 'Follow-up Requirements',
    description: 'Information, verification, asset, or response required before this Follow-up Action is complete.',
    universalSettings: { displayedMaxRows: 12 },
  } as FieldConfig;
};

export const buildFollowUpTaskTargetKeyFieldConfig = (): FieldConfig => ({
  universalIdentifier: FOLLOW_UP_TASK_FIELD_IDS.fairlendTaskTargetKey,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget.universalIdentifier,
  type: FieldType.TEXT,
  name: 'fairlendTaskTargetKey',
  label: 'FairLend Task Target Key',
  description: 'Stable idempotency key for a Follow-up Action to Partner Lead association.',
  isNullable: true,
  isUnique: true,
  isUIEditable: false,
}) as FieldConfig;
