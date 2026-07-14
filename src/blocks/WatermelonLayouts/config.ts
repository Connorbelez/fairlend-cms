import type { Block } from 'payload'

import { createWatermelonLayoutFields } from './fields'

export const WatermelonLayoutBlocks: Block[] = [
  {
    slug: 'watermelonBusinessManagement',
    interfaceName: 'WatermelonBusinessManagementBlock',
    labels: {
      singular: 'Watermelon Business Management',
      plural: 'Watermelon Business Management',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
  {
    slug: 'watermelonBusinessOperationsDashboard',
    interfaceName: 'WatermelonBusinessOperationsDashboardBlock',
    labels: {
      singular: 'Watermelon Business Operations Dashboard',
      plural: 'Watermelon Business Operations Dashboard',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
  {
    slug: 'watermelonECommerceDashboard',
    interfaceName: 'WatermelonECommerceDashboardBlock',
    labels: {
      singular: 'Watermelon E-Commerce Dashboard',
      plural: 'Watermelon E-Commerce Dashboard',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
  {
    slug: 'watermelonErpDashboard',
    interfaceName: 'WatermelonErpDashboardBlock',
    labels: {
      singular: 'Watermelon ERP Dashboard',
      plural: 'Watermelon ERP Dashboard',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
  {
    slug: 'watermelonHrm',
    interfaceName: 'WatermelonHrmBlock',
    labels: {
      singular: 'Watermelon HRM',
      plural: 'Watermelon HRM',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
  {
    slug: 'watermelonIncidentManagement',
    interfaceName: 'WatermelonIncidentManagementBlock',
    labels: {
      singular: 'Watermelon Incident Management',
      plural: 'Watermelon Incident Management',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
  {
    slug: 'watermelonInvoiceGeneratorDashboard',
    interfaceName: 'WatermelonInvoiceGeneratorDashboardBlock',
    labels: {
      singular: 'Watermelon Invoice Generator Dashboard',
      plural: 'Watermelon Invoice Generator Dashboard',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
  {
    slug: 'watermelonInvoiceManagerDashboard',
    interfaceName: 'WatermelonInvoiceManagerDashboardBlock',
    labels: {
      singular: 'Watermelon Invoice Manager Dashboard',
      plural: 'Watermelon Invoice Manager Dashboard',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
  {
    slug: 'watermelonIssueTracking',
    interfaceName: 'WatermelonIssueTrackingBlock',
    labels: {
      singular: 'Watermelon Issue Tracking',
      plural: 'Watermelon Issue Tracking',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
  {
    slug: 'watermelonLeadDashboard',
    interfaceName: 'WatermelonLeadDashboardBlock',
    labels: {
      singular: 'Watermelon Lead Dashboard',
      plural: 'Watermelon Lead Dashboard',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
  {
    slug: 'watermelonMailDashboard',
    interfaceName: 'WatermelonMailDashboardBlock',
    labels: {
      singular: 'Watermelon Mail Dashboard',
      plural: 'Watermelon Mail Dashboard',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
  {
    slug: 'watermelonMeetingsDashboard',
    interfaceName: 'WatermelonMeetingsDashboardBlock',
    labels: {
      singular: 'Watermelon Meetings Dashboard',
      plural: 'Watermelon Meetings Dashboard',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
  {
    slug: 'watermelonPaymentOperationsDashboard',
    interfaceName: 'WatermelonPaymentOperationsDashboardBlock',
    labels: {
      singular: 'Watermelon Payment Operations Dashboard',
      plural: 'Watermelon Payment Operations Dashboard',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
  {
    slug: 'watermelonProjectManagementDashboard',
    interfaceName: 'WatermelonProjectManagementDashboardBlock',
    labels: {
      singular: 'Watermelon Project Management Dashboard',
      plural: 'Watermelon Project Management Dashboard',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
  {
    slug: 'watermelonSalesDashboard',
    interfaceName: 'WatermelonSalesDashboardBlock',
    labels: {
      singular: 'Watermelon Sales Dashboard',
      plural: 'Watermelon Sales Dashboard',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
  {
    slug: 'watermelonTaskManagementDashboard',
    interfaceName: 'WatermelonTaskManagementDashboardBlock',
    labels: {
      singular: 'Watermelon Task Management Dashboard',
      plural: 'Watermelon Task Management Dashboard',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
  {
    slug: 'watermelonWorkflowManagementDashboard',
    interfaceName: 'WatermelonWorkflowManagementDashboardBlock',
    labels: {
      singular: 'Watermelon Workflow Management Dashboard',
      plural: 'Watermelon Workflow Management Dashboard',
    },
    admin: {
      group: 'Watermelon layouts',
    },
    fields: createWatermelonLayoutFields(),
  },
]
