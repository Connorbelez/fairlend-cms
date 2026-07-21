import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { PostAttribution } from '@/components/PostAttribution'
import { getPostAuthors } from '@/utilities/postAuthors'
import { buildArticleJsonLd, buildPersonJsonLd } from '@/utilities/structuredData'

const attributedPost = {
  createdAt: '2026-07-18T12:00:00.000Z',
  populatedAuthors: [
    {
      bio: 'Leads mortgage brokerage and construction-finance strategy across Ontario.',
      id: '1',
      name: 'Elie Soberano',
      officialTitle: 'Founder, Principal Broker & MIC Director',
    },
  ],
  publishedAt: '2026-07-18T12:00:00.000Z',
  updatedAt: '2026-07-20T15:30:00.000Z',
}

describe('blog author attribution', () => {
  it('renders the author name, official title, mini bio, release date, and update date', () => {
    const markup = renderToStaticMarkup(<PostAttribution post={attributedPost} />)

    expect(markup).toContain('Elie Soberano')
    expect(markup).toContain('Founder, Principal Broker &amp; MIC Director')
    expect(markup).toContain(
      'Leads mortgage brokerage and construction-finance strategy across Ontario.',
    )
    expect(markup).toContain('dateTime="2026-07-18T12:00:00.000Z"')
    expect(markup).toContain('dateTime="2026-07-20T15:30:00.000Z"')
  })

  it('uses an honest organization attribution for legacy releases with incomplete authors', () => {
    expect(
      getPostAuthors({
        populatedAuthors: [{ id: '2', name: 'Legacy author' }],
      }),
    ).toEqual([
      expect.objectContaining({
        isOrganization: true,
        name: 'FairLend Mortgage',
        officialTitle: 'Ontario mortgage brokerage editorial team',
      }),
    ])
  })

  it('publishes complete Person and BlogPosting author structured data', () => {
    const author = {
      bio: attributedPost.populatedAuthors[0]!.bio,
      name: attributedPost.populatedAuthors[0]!.name,
      officialTitle: attributedPost.populatedAuthors[0]!.officialTitle,
    }
    const person = buildPersonJsonLd(author)
    const article = buildArticleJsonLd({
      authors: [author],
      dateModified: attributedPost.updatedAt,
      datePublished: attributedPost.publishedAt,
      description: 'A practical Ontario mortgage guide.',
      path: '/posts/practical-guide',
      title: 'Practical guide',
    })

    expect(person).toMatchObject({
      '@type': 'Person',
      description: author.bio,
      jobTitle: author.officialTitle,
      name: author.name,
    })
    expect(article).toMatchObject({
      '@type': 'BlogPosting',
      author: [{ '@id': person['@id'] }],
      dateModified: attributedPost.updatedAt,
      datePublished: attributedPost.publishedAt,
    })
  })
})
