import { defineField } from 'twenty-sdk/define';

import { buildFollowUpTaskFieldConfig } from 'src/schema/follow-up-task-model';

export default defineField(buildFollowUpTaskFieldConfig('followUpRequirements'));
