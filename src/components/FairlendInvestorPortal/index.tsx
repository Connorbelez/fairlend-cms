import type { ReactElement } from 'react'
import { ArrowUpRight, Download, FileText, Wallet } from 'lucide-react'

import './investor-portal.css'

type Callout = {
  id: string
  number: string
  label: string
  detail: string
}

const callouts: readonly Callout[] = [
  {
    detail: 'Every mortgage you hold, with its current status and documentation.',
    id: 'holdings',
    label: 'Holdings & deal status',
    number: '1',
  },
  {
    detail: 'Every payment collected from the borrower, tracked end to end.',
    id: 'payments',
    label: 'Payment history',
    number: '2',
  },
  {
    detail: 'Every disbursement to you, logged and reconciled automatically.',
    id: 'disbursements',
    label: '“Disbursement sent” record',
    number: '3',
  },
  {
    detail: 'The full document set behind each mortgage, available on demand.',
    id: 'vault',
    label: 'Document vault',
    number: '4',
  },
  {
    detail: 'Tax-ready documents exported in a click when it’s time to file.',
    id: 'tax',
    label: 'Tax export',
    number: '5',
  },
  {
    detail: 'Activity synced to QuickBooks so your books stay current.',
    id: 'quickbooks',
    label: 'QuickBooks sync',
    number: '6',
  },
]

/**
 * Section 6 — Inside the Investor Portal (Concept A, annotated screenshot).
 *
 * A realistic portal mock with six numbered callouts. Restrained financial UI:
 * tables, ledger rows, status states, document tiles. No celebratory yield
 * graphics. Lime reserved for the live-status pulse and the disbursement chip.
 */
export function FairlendInvestorPortal(): ReactElement {
  return (
    <section
      aria-labelledby="investor-portal-title"
      className="investor-portal"
      data-investor-portal
      id="investor-portal"
    >
      <div className="investor-portal__inner">
        <header className="investor-portal__header">
          <p className="investor-portal__eyebrow">Inside the investor portal</p>
          <h2 className="investor-portal__title" id="investor-portal-title">
            See everything, chase nothing.
          </h2>
          <p className="investor-portal__lede">
            Your portal shows live deal status, every payment collected and disbursed, and the full
            document set behind each mortgage. When it&apos;s time to file, export tax-ready
            documents in a click and sync activity straight to QuickBooks — no spreadsheets, no
            manual reconciliation.
          </p>
        </header>

        <div className="investor-portal__stage">
          <div className="investor-portal__ui" aria-hidden="true">
            <div className="investor-portal__ui-chrome">
              <span className="investor-portal__ui-chrome-dot" />
              <span className="investor-portal__ui-chrome-file">
                fairlend.ca/investor/holdings
              </span>
              <span className="investor-portal__ui-chrome-spacer" />
            </div>

            <div className="investor-portal__ui-body">
              <div className="investor-portal__ui-sidebar">
                <span className="investor-portal__ui-sidebar-item is-active">Holdings</span>
                <span className="investor-portal__ui-sidebar-item">Payments</span>
                <span className="investor-portal__ui-sidebar-item">Disbursements</span>
                <span className="investor-portal__ui-sidebar-item">Documents</span>
                <span className="investor-portal__ui-sidebar-item">Tax export</span>
                <span className="investor-portal__ui-sidebar-item">QuickBooks</span>
              </div>

              <div className="investor-portal__ui-main">
                <div className="investor-portal__ui-toolbar">
                  <span className="investor-portal__ui-toolbar-title">Holdings · 3 active</span>
                  <span className="investor-portal__ui-toolbar-pill">
                    <span aria-hidden="true" className="investor-portal__ui-pulse" />
                    Live
                  </span>
                </div>

                <div className="investor-portal__ui-table">
                  <div className="investor-portal__ui-table-head">
                    <span>File</span>
                    <span>Position</span>
                    <span>LTV</span>
                    <span>Last payment</span>
                    <span>Status</span>
                  </div>
                  <div className="investor-portal__ui-table-row">
                    <span>FL-INV-0421</span>
                    <span>1st</span>
                    <span>68%</span>
                    <span>Paid · PAD</span>
                    <span className="investor-portal__ui-status investor-portal__ui-status--ok">
                      Disbursement sent
                    </span>
                  </div>
                  <div className="investor-portal__ui-table-row">
                    <span>FL-INV-0388</span>
                    <span>2nd</span>
                    <span>71%</span>
                    <span>Paid · PAD</span>
                    <span className="investor-portal__ui-status investor-portal__ui-status--current">
                      Current
                    </span>
                  </div>
                  <div className="investor-portal__ui-table-row">
                    <span>FL-INV-0342</span>
                    <span>1st</span>
                    <span>62%</span>
                    <span>Scheduled</span>
                    <span className="investor-portal__ui-status investor-portal__ui-status--scheduled">
                      Scheduled
                    </span>
                  </div>
                </div>

                <div className="investor-portal__ui-tiles">
                  <div className="investor-portal__ui-tile">
                    <FileText aria-hidden="true" size={16} strokeWidth={1.8} />
                    <span>Document vault · 18 files</span>
                  </div>
                  <div className="investor-portal__ui-tile">
                    <Download aria-hidden="true" size={16} strokeWidth={1.8} />
                    <span>Tax export · 2025 ready</span>
                  </div>
                  <div className="investor-portal__ui-tile">
                    <Wallet aria-hidden="true" size={16} strokeWidth={1.8} />
                    <span>QuickBooks · synced 2h ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ol aria-label="Annotated portal features" className="investor-portal__callouts">
            {callouts.map((callout) => (
              <li className="investor-portal__callout" key={callout.id}>
                <span aria-hidden="true" className="investor-portal__callout-number">
                  {callout.number}
                </span>
                <div>
                  <h3 className="investor-portal__callout-label">{callout.label}</h3>
                  <p className="investor-portal__callout-detail">{callout.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="investor-portal__day-in-life">
          <h3 className="investor-portal__day-title">What your month looks like</h3>
          <p className="investor-portal__day-copy">
            Payments are collected by PAD, your disbursement lands automatically, and the portal
            logs all of it. You open the app when <em>you</em> want to — to check a file, pull a
            document, or export your records for QuickBooks and tax time. The administration is
            ours. The visibility is yours.
          </p>
          <span className="investor-portal__day-mark" aria-hidden="true">
            <ArrowUpRight size={14} strokeWidth={2.25} />
          </span>
        </div>
      </div>
    </section>
  )
}
