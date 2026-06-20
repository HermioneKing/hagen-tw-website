import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type RichTextContentProps = {
  content?: SerializedEditorState | null
}

export function RichTextContent({ content }: RichTextContentProps) {
  if (!content) return null

  return (
    <div className="prose-hagen text-[15px] leading-[1.47] tracking-[-0.2px] text-graphite [&_p]:mb-4">
      <RichText data={content} />
    </div>
  )
}
