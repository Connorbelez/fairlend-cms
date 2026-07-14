export type InvoiceRow = {
  id: number
  company: string
  clientName: string
  dealValue: string
  businessReport: string
  invoiceDate: string
  status: 'Accepted' | 'Rejected' | 'Under Review' | 'Processing'
  category: string
}

export const invoiceData: InvoiceRow[] = [
  { id: 1, company: 'Northstar Capital', clientName: 'Avery Stone', dealValue: '$42,500', businessReport: 'Bridge financing review completed', invoiceDate: 'Jun 12, 2026', status: 'Accepted', category: 'Finance' },
  { id: 2, company: 'Harbour Lane', clientName: 'Maya Chen', dealValue: '$18,900', businessReport: 'Borrower package pending appraisal', invoiceDate: 'Jun 14, 2026', status: 'Under Review', category: 'Lending' },
  { id: 3, company: 'Pinecrest Homes', clientName: 'Noah Patel', dealValue: '$31,250', businessReport: 'Renewal terms sent for approval', invoiceDate: 'Jun 17, 2026', status: 'Processing', category: 'Operations' },
  { id: 4, company: 'Summit Advisory', clientName: 'Elena Rossi', dealValue: '$12,400', businessReport: 'Missing supporting documents', invoiceDate: 'Jun 19, 2026', status: 'Rejected', category: 'Compliance' },
  { id: 5, company: 'Cedar Ridge', clientName: 'Liam Wright', dealValue: '$27,750', businessReport: 'Investor statement reconciled', invoiceDate: 'Jun 22, 2026', status: 'Accepted', category: 'Accounting' },
]
