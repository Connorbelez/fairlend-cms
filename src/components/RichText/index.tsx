import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { cn } from '@/utilities/ui'
import { cva, type VariantProps } from 'class-variance-authority'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof richTextVariants>

const richTextVariants = cva('', {
  defaultVariants: {
    variant: 'default',
  },
  variants: {
    variant: {
      default: '',
      journal:
        'text-[#303733] prose-headings:text-[#08090a] prose-headings:font-[family-name:var(--font-cormorant)] prose-headings:font-semibold prose-headings:tracking-[-0.025em] prose-headings:text-balance prose-h2:mt-16 prose-h2:border-t prose-h2:border-[#deded8] prose-h2:pt-8 prose-h2:text-[clamp(2.25rem,4vw,3.5rem)] prose-h2:leading-none prose-h3:mt-10 prose-h3:text-[clamp(1.75rem,3vw,2.25rem)] prose-h3:leading-tight prose-p:max-w-[68ch] prose-p:text-lg prose-p:leading-8 prose-p:font-medium prose-p:text-[#303733] prose-a:font-bold prose-a:text-[#18352f] prose-a:decoration-[#96ec18] prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:text-[#315a12] prose-strong:font-extrabold prose-strong:text-[#08090a] prose-blockquote:my-10 prose-blockquote:border-l-2 prose-blockquote:border-[#96ec18] prose-blockquote:bg-[#fffdf9] prose-blockquote:px-6 prose-blockquote:py-5 prose-blockquote:font-[family-name:var(--font-cormorant)] prose-blockquote:text-2xl prose-blockquote:leading-snug prose-blockquote:font-semibold prose-blockquote:text-[#18352f] prose-li:my-2 prose-li:marker:text-[#315a12] prose-hr:my-12 prose-hr:border-[#deded8] prose-img:grayscale prose-img:contrast-[1.06] prose-figcaption:text-sm prose-figcaption:font-semibold prose-figcaption:text-[#6c6c64]',
    },
  },
})

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, variant = 'default', ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse && variant === 'default',
          'mx-auto prose prose-lg max-w-none': enableProse && variant === 'journal',
        },
        richTextVariants({ variant }),
        className,
      )}
      {...rest}
    />
  )
}
