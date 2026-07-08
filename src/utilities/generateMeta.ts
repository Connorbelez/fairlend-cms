import type { Metadata } from 'next'

import type { Page, Post } from '../payload-types'

import {
  buildFairlendMetadata,
  getPayloadDescription,
  getPayloadPagePath,
  getPayloadPostPath,
  getPayloadTitle,
} from './seo'

export const generateMeta = async (args: {
  collection?: 'pages' | 'posts'
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { collection = 'pages', doc } = args
  const path =
    collection === 'posts' ? getPayloadPostPath(doc as Partial<Post>) : getPayloadPagePath(doc)

  return buildFairlendMetadata({
    description: getPayloadDescription(doc),
    image: doc?.meta?.image,
    path,
    title: getPayloadTitle(doc),
    type: collection === 'posts' ? 'article' : 'website',
  })
}
