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
import { BeforeAfterBlock } from './blocks/BeforeAfter/Component'
import { CodeBlock, CodeBlockProps } from './blocks/Code/Component'
import { GalleryBlock } from './blocks/Gallery/Component'
import { MediaBlock } from './blocks/MediaBlock/Component'

import type {
  BannerBlock as BannerBlockProps,
  BeforeAfterBlock as BeforeAfterBlockProps,
  GalleryBlock as GalleryBlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload/payload-types'
import { cn } from '@/shared/utils/ui'
import { CMSLink, type CMSLinkType } from '@/shared/components/Link'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | MediaBlockProps
      | BannerBlockProps
      | CodeBlockProps
      | GalleryBlockProps
      | BeforeAfterBlockProps
    >

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug

  // Keep in sync with the route folders under src/app/(frontend).
  const prefixes: Record<string, string> = {
    posts: '/posts',
    projects: '/realizace',
    services: '/sluzby',
  }

  return `${prefixes[relationTo] ?? ''}/${slug}`
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

    // Lists get explicit markers and spacing rather than inheriting whatever
    // `prose` decides. Nested lists keep their own marker style.
    list: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })

      if (node.listType === 'check') {
        return <ul className="my-6 list-none space-y-2 pl-0">{children}</ul>
      }
      if (node.tag === 'ol') {
        return (
          <ol className="my-6 list-decimal space-y-2 pl-6 marker:font-medium marker:text-muted-foreground">
            {children}
          </ol>
        )
      }
      return (
        <ul className="my-6 list-disc space-y-2 pl-6 marker:text-muted-foreground">{children}</ul>
      )
    },

    listitem: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })

      // A checklist item carries its state in the node, so render a real
      // checkbox rather than a bullet the reader cannot interpret.
      if (typeof node.checked === 'boolean') {
        return (
          <li className="flex items-start gap-2.5">
            <input
              checked={node.checked}
              className="mt-1.5 size-4 shrink-0 accent-foreground"
              disabled
              readOnly
              type="checkbox"
            />
            <span className={cn(node.checked && 'text-muted-foreground line-through')}>
              {children}
            </span>
          </li>
        )
      }

      return <li className="pl-1.5 leading-relaxed">{children}</li>
    },

    quote: ({ node, nodesToJSX }) => (
      <blockquote className="my-8 border-l-2 border-border pl-6 text-lg italic text-muted-foreground">
        {nodesToJSX({ nodes: node.children })}
      </blockquote>
    ),

    horizontalrule: () => <hr className="my-12 border-border" />,

    blocks: {
      banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
      beforeAfter: ({ node }) => <BeforeAfterBlock className="my-8" {...node.fields} />,
      gallery: ({ node }) => <GalleryBlock className="my-8" {...node.fields} />,
      mediaBlock: ({ node }) => (
        <MediaBlock
          className="col-start-1 col-span-3"
          imgClassName="m-0 rounded-lg"
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
          'mx-auto prose md:prose-md': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
