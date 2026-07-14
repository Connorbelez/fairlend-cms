import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'
import { notifyIndexNowChange } from '../../../lib/indexnow'

export const revalidatePage: CollectionAfterChangeHook<Page> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

      payload.logger.info(`Revalidating page at path: ${path}`)

      revalidatePath(path)
      revalidateTag('pages-sitemap', 'max')
      await notifyIndexNowChange({
        changeType: previousDoc?._status === 'published' ? 'updated' : 'published',
        documentId: doc.id,
        documentUpdatedAt: doc.updatedAt,
        path,
        sourceCollection: 'pages',
      })
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old page at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('pages-sitemap', 'max')
      await notifyIndexNowChange({
        changeType: 'unpublished',
        documentId: previousDoc.id,
        documentUpdatedAt: doc.updatedAt,
        path: oldPath,
        sourceCollection: 'pages',
      })
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = async ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
    revalidatePath(path)
    revalidateTag('pages-sitemap', 'max')
    await notifyIndexNowChange({
      changeType: 'deleted',
      documentId: doc.id,
      documentUpdatedAt: doc.updatedAt,
      path,
      sourceCollection: 'pages',
    })
  }

  return doc
}
