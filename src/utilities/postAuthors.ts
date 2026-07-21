import type { Post } from '@/payload-types'

export type PostAuthorAttribution = {
  bio: string
  id?: string | null
  isOrganization?: boolean
  name: string
  officialTitle: string
}

export const fairlendEditorialAuthor: PostAuthorAttribution = {
  bio: 'FairLend Mortgage publishes practical Ontario mortgage guidance informed by its brokerage, lending, construction-finance, and mortgage-administration work.',
  isOrganization: true,
  name: 'FairLend Mortgage',
  officialTitle: 'Ontario mortgage brokerage editorial team',
}

/**
 * Returns only complete, public-safe author profiles. Legacy releases without a
 * complete profile receive an honest organization attribution until an editor
 * assigns a fully credentialed author.
 */
export const getPostAuthors = (post: Pick<Post, 'populatedAuthors'>): PostAuthorAttribution[] => {
  const authors =
    post.populatedAuthors?.flatMap((author) => {
      const name = author.name?.trim()
      const officialTitle = author.officialTitle?.trim()
      const bio = author.bio?.trim()

      if (!name || !officialTitle || !bio) return []

      return [
        {
          bio,
          id: author.id,
          name,
          officialTitle,
        },
      ]
    }) || []

  return authors.length > 0 ? authors : [fairlendEditorialAuthor]
}
