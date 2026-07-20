const editorialDateFormatter = new Intl.DateTimeFormat('en-CA', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
})

export const formatEditorialDate = (timestamp: string): string =>
  editorialDateFormatter.format(new Date(timestamp))
