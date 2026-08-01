import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  type JSXConverters,
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { BannerBlock } from './blocks/Banner/Component'
import { CodeBlock, CodeBlockProps } from './blocks/Code/Component'
import { MediaBlock } from './blocks/MediaBlock/Component'

import type {
  BannerBlock as BannerBlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload/payload-types'
import { cn } from '@/shared/utils/ui'
import { CMSLink, type CMSLinkType } from '@/shared/components/Link'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<MediaBlockProps | BannerBlockProps | CodeBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  /**
   * Converters for domain-owned blocks embedded in this rich text field.
   * shared/ must not import domains/, so a domain whose block can appear in
   * rich text (e.g. pages' CallToAction) injects its converter here.
   */
  blockConverters?: JSXConverters['blocks']
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, blockConverters, enableProse = true, enableGutter = true, ...rest } = props

  const defaultLinkConverters = LinkJSXConverter({ internalDocToHref })

  const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
    ...defaultConverters,
    ...defaultLinkConverters,
    link: (args) => {
      if (args.node.fields.linkType === 'internal') {
        return (
          <CMSLink
            appearance="inline"
            newTab={args.node.fields.newTab}
            reference={args.node.fields.doc as CMSLinkType['reference']}
            type="reference"
          >
            {args.nodesToJSX({ nodes: args.node.children })}
          </CMSLink>
        )
      }
      const { link } = defaultLinkConverters
      return typeof link === 'function' ? link(args) : link
    },
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
      ...blockConverters,
    },
  })

  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
