'use client';

import type { BlockObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

type Props = {
  blocks: BlockObjectResponse[];
};

const RichText = ({ text }: { text: RichTextItemResponse[] }) => {
  if (!text) return null;
  return (
    <>
      {text.map((t, i) => {
        const { annotations } = t;
        let className = '';
        if (annotations.bold) className += ' font-bold';
        if (annotations.italic) className += ' italic';
        if (annotations.strikethrough) className += ' line-through';
        if (annotations.underline) className += ' underline';
        if (annotations.code) className += ' bg-gray-200 rounded px-1 font-mono text-sm text-red-500';

        return (
          <span key={i} className={className} style={{ color: t.annotations.color !== 'default' ? t.annotations.color : undefined }}>
            {t.plain_text}
          </span>
        );
      })}
    </>
  );
};

export default function PostRenderer({ blocks }: Props) {
  if (!blocks) {
    return <div>No content</div>;
  }

  const renderBlock = (block: BlockObjectResponse) => {
    switch (block.type) {
      case 'paragraph':
        if (block.paragraph.rich_text.length === 0) {
          return <div className="h-6" aria-hidden="true" />;
        }
        return (
          <p className="mb-4 text-gray-800 leading-relaxed whitespace-pre-wrap">
            <RichText text={block.paragraph.rich_text} />
          </p>
        );
      case 'heading_1':
        return (
          <h1 className="text-3xl font-bold mt-8 mb-4">
            <RichText text={block.heading_1.rich_text} />
          </h1>
        );
      case 'heading_2':
        return (
          <h2 className="text-2xl font-bold mt-6 mb-3">
            <RichText text={block.heading_2.rich_text} />
          </h2>
        );
      case 'heading_3':
        return (
          <h3 className="text-xl font-bold mt-4 mb-2">
            <RichText text={block.heading_3.rich_text} />
          </h3>
        );
      case 'bulleted_list_item':
        return (
          <li className="ml-4 list-disc mb-2">
            <RichText text={block.bulleted_list_item.rich_text} />
          </li>
        );
      case 'numbered_list_item':
        return (
          <li className="ml-4 list-decimal mb-2">
            <RichText text={block.numbered_list_item.rich_text} />
          </li>
        );
      case 'code':
        return (
          <pre className="bg-gray-800 text-white p-4 rounded mb-4 overflow-x-auto">
            <code>
              <RichText text={block.code.rich_text} />
            </code>
          </pre>
        );
      case 'image':
         // Basic image support (external or file)
         const src = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
         const caption = block.image.caption?.length ? <div className="text-center text-sm text-gray-500 mt-1"><RichText text={block.image.caption} /></div> : null;
         return (
            <figure className="mb-6">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Notion Image" className="rounded-lg shadow-md max-w-full h-auto" />
                {caption}
            </figure>
         );
      case 'quote':
          return (
              <blockquote className="border-l-4 border-gray-300 pl-4 py-2 italic my-4 bg-gray-50 text-gray-700">
                  <RichText text={block.quote.rich_text} />
              </blockquote>
          )
      default:
        return (
          <div className="text-gray-400 text-xs mb-2">
            Unsupported block type: {block.type}
          </div>
        );
    }
  };

  return (
    <div className="notion-content">
      {blocks.map((block) => (
        <div key={block.id}>{renderBlock(block)}</div>
      ))}
    </div>
  );
}
