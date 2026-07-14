import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'
import { notifyIndexNowChange } from '../../../lib/indexnow'

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/posts/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidateTag('posts-sitemap', 'max')
      await notifyIndexNowChange({
        changeType: previousDoc?._status === 'published' ? 'updated' : 'published',
        documentId: doc.id,
        documentUpdatedAt: doc.updatedAt,
        path,
        sourceCollection: 'posts',
      })
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/posts/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('posts-sitemap', 'max')
      await notifyIndexNowChange({
        changeType: 'unpublished',
        documentId: previousDoc.id,
        documentUpdatedAt: doc.updatedAt,
        path: oldPath,
        sourceCollection: 'posts',
      })
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = async ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/posts/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('posts-sitemap', 'max')
    await notifyIndexNowChange({
      changeType: 'deleted',
      documentId: doc.id,
      documentUpdatedAt: doc.updatedAt,
      path,
      sourceCollection: 'posts',
    })
  }

  return doc
}
