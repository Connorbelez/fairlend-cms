type GoogleErrorDetail = {
  '@type'?: string
  metadata?: {
    activationUrl?: string
    service?: string
    serviceTitle?: string
  }
  reason?: string
}

type GoogleErrorPayload = {
  error?: {
    code?: number
    details?: GoogleErrorDetail[]
    message?: string
    status?: string
  }
}

type GooglePlacesErrorBody = {
  error: string
  googleActivationUrl?: string
  googleMessage?: string
  googleReason?: string
  googleStatus?: string
  upstreamStatus: number
}

export async function googlePlacesErrorResponse(
  googleResponse: Response,
  fallbackMessage: string,
): Promise<Response> {
  const upstreamError = await readGoogleError(googleResponse)
  const details = upstreamError?.error?.details ?? []
  const errorInfo = details.find((detail) => detail.reason || detail.metadata)
  const googleReason = errorInfo?.reason
  const googleStatus = upstreamError?.error?.status
  const googleMessage = upstreamError?.error?.message
  const googleActivationUrl = errorInfo?.metadata?.activationUrl

  if (process.env.NODE_ENV !== 'production') {
    console.error('[google-places] upstream request failed', {
      googleActivationUrl,
      googleMessage,
      googleReason,
      googleStatus,
      upstreamStatus: googleResponse.status,
    })
  }

  const body: GooglePlacesErrorBody = {
    error: fallbackMessage,
    upstreamStatus: googleResponse.status,
  }

  if (process.env.NODE_ENV !== 'production') {
    body.googleActivationUrl = googleActivationUrl
    body.googleMessage = googleMessage
    body.googleReason = googleReason
    body.googleStatus = googleStatus
  }

  return Response.json(body, { status: 502 })
}

async function readGoogleError(response: Response): Promise<GoogleErrorPayload | null> {
  const text = await response.text().catch(() => '')

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text) as GoogleErrorPayload
  } catch {
    return null
  }
}
