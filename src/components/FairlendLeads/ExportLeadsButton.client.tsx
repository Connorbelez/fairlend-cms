'use client'

import { Button, toast } from '@payloadcms/ui'
import React, { useCallback, useState } from 'react'

import './export-leads-button.scss'

const exportEndpoint = '/api/fairlend-leads/export'
const fallbackFilename = 'fairlend-leads.csv'

export default function ExportLeadsButton(): React.ReactElement {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = useCallback(async () => {
    if (isExporting) {
      return
    }

    setIsExporting(true)

    try {
      const response = await fetch(exportEndpoint, {
        credentials: 'include',
        method: 'GET',
      })

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error || 'Unable to export leads')
      }

      const blob = await response.blob()
      const downloadUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      const exportedCount = Number(response.headers.get('X-Exported-Count'))

      anchor.download = getDownloadFilename(response.headers.get('Content-Disposition'))
      anchor.href = downloadUrl
      anchor.style.display = 'none'
      document.body.append(anchor)
      anchor.click()
      anchor.remove()
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0)

      toast.success(
        Number.isFinite(exportedCount)
          ? `Exported ${exportedCount} ${exportedCount === 1 ? 'lead' : 'leads'}.`
          : 'Lead export downloaded.',
      )
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to export leads')
    } finally {
      setIsExporting(false)
    }
  }, [isExporting])

  return (
    <div className="fairlend-leads-export">
      <Button
        aria-label="Export every FairLend lead to CSV"
        buttonStyle="primary"
        disabled={isExporting}
        margin={false}
        onClick={() => void handleExport()}
        size="medium"
        type="button"
      >
        {isExporting ? 'Exporting…' : 'Export to CSV'}
      </Button>
    </div>
  )
}

function getDownloadFilename(contentDisposition: string | null): string {
  const encodedFilename = contentDisposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1]
  if (encodedFilename) {
    try {
      return decodeURIComponent(encodedFilename)
    } catch {
      return encodedFilename
    }
  }

  return contentDisposition?.match(/filename="?([^";]+)"?/i)?.[1] || fallbackFilename
}
