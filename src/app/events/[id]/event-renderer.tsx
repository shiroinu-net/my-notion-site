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
        const style: React.CSSProperties = {};
        if (annotations.bold) style.fontWeight = 600;
        if (annotations.italic) style.fontStyle = 'italic';
        if (annotations.strikethrough) style.textDecoration = 'line-through';
        if (annotations.underline) style.textDecoration = 'underline';
        if (annotations.color !== 'default') style.color = annotations.color;

        if (annotations.code) {
          return (
            <code
              key={i}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '.88em',
                background: 'rgba(131,122,160,.12)',
                color: 'var(--rs-violet)',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              {t.plain_text}
            </code>
          );
        }

        const content =
          t.href && t.type === 'text' ? (
            <a
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--rs-violet)', textDecoration: 'underline', textUnderlineOffset: 3 }}
            >
              {t.plain_text}
            </a>
          ) : (
            t.plain_text
          );

        return (
          <span key={i} style={style}>
            {content}
          </span>
        );
      })}
    </>
  );
};

export default function EventRenderer({ blocks }: Props) {
  if (!blocks || blocks.length === 0) {
    return (
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 18,
          color: 'var(--rs-slate4)',
        }}
      >
        — no further details.
      </p>
    );
  }

  const renderBlock = (block: BlockObjectResponse) => {
    switch (block.type) {
      case 'paragraph':
        if (block.paragraph.rich_text.length === 0) {
          return <div style={{ height: 18 }} aria-hidden="true" />;
        }
        return (
          <p
            style={{
              margin: '0 0 18px',
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 300,
              fontSize: 14.5,
              lineHeight: 2.15,
              color: 'var(--rs-slate1)',
              whiteSpace: 'pre-wrap',
            }}
          >
            <RichText text={block.paragraph.rich_text} />
          </p>
        );
      case 'heading_1':
        return (
          <h2
            style={{
              margin: '40px 0 16px',
              fontFamily: "'Noto Serif JP', serif",
              fontWeight: 400,
              fontSize: 'clamp(24px,3.4vw,32px)',
              color: 'var(--rs-ink)',
              lineHeight: 1.4,
            }}
          >
            <RichText text={block.heading_1.rich_text} />
          </h2>
        );
      case 'heading_2':
        return (
          <h3
            style={{
              margin: '34px 0 14px',
              fontFamily: "'Noto Serif JP', serif",
              fontWeight: 400,
              fontSize: 'clamp(20px,2.6vw,26px)',
              color: 'var(--rs-ink)',
              lineHeight: 1.45,
            }}
          >
            <RichText text={block.heading_2.rich_text} />
          </h3>
        );
      case 'heading_3':
        return (
          <h4
            style={{
              margin: '28px 0 12px',
              fontFamily: "'Noto Serif JP', serif",
              fontWeight: 400,
              fontSize: 'clamp(17px,2vw,21px)',
              color: 'var(--rs-slate1)',
              lineHeight: 1.5,
            }}
          >
            <RichText text={block.heading_3.rich_text} />
          </h4>
        );
      case 'bulleted_list_item':
        return (
          <li
            style={{
              margin: '0 0 8px 22px',
              listStyleType: 'disc',
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 300,
              fontSize: 14.5,
              lineHeight: 2.15,
              color: 'var(--rs-slate1)',
            }}
          >
            <RichText text={block.bulleted_list_item.rich_text} />
          </li>
        );
      case 'numbered_list_item':
        return (
          <li
            style={{
              margin: '0 0 8px 22px',
              listStyleType: 'decimal',
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 300,
              fontSize: 14.5,
              lineHeight: 2.15,
              color: 'var(--rs-slate1)',
            }}
          >
            <RichText text={block.numbered_list_item.rich_text} />
          </li>
        );
      case 'code':
        return (
          <pre
            style={{
              margin: '0 0 22px',
              background: 'var(--rs-ink)',
              color: 'var(--rs-fog)',
              padding: 20,
              borderRadius: 8,
              overflowX: 'auto',
              fontFamily: "'Space Mono', monospace",
              fontSize: 13.5,
              lineHeight: 1.7,
            }}
          >
            <code>
              <RichText text={block.code.rich_text} />
            </code>
          </pre>
        );
      case 'quote':
        return (
          <blockquote
            style={{
              margin: '22px 0',
              padding: '6px 0 6px 22px',
              borderLeft: '2px solid var(--rs-lilac)',
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 20,
              lineHeight: 1.6,
              color: 'var(--rs-violet)',
            }}
          >
            <RichText text={block.quote.rich_text} />
          </blockquote>
        );
      case 'image': {
        let src = '';
        if (block.image.type === 'external') {
          const externalUrl = block.image.external.url;
          const skipDomains = ['gstatic.com', 'youtube.com', 'ytimg.com'];
          if (skipDomains.some((d) => externalUrl.includes(d))) return null;
          src = externalUrl;
        } else {
          // file type: ローカル取得済み画像を参照 (scripts/fetch-images.mjs の命名規則に合わせる)
          const filename = `${block.id}.webp`;
          src = `/notion-images/${filename}`;
        }
        const caption = block.image.caption?.length ? (
          <figcaption
            style={{
              marginTop: 10,
              textAlign: 'center',
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 15,
              color: 'var(--rs-slate4)',
            }}
          >
            <RichText text={block.image.caption} />
          </figcaption>
        ) : null;
        return (
          <figure style={{ margin: '28px 0' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="Event image"
              style={{ width: '100%', height: 'auto', borderRadius: 10, display: 'block' }}
            />
            {caption}
          </figure>
        );
      }
      default:
        return null;
    }
  };

  // 連続する同種リストブロックをグループ化
  const grouped: Array<{ type: 'list'; listType: 'ul' | 'ol'; items: BlockObjectResponse[] } | { type: 'block'; block: BlockObjectResponse }> = [];
  for (const block of blocks) {
    if (block.type === 'bulleted_list_item') {
      const last = grouped[grouped.length - 1];
      if (last?.type === 'list' && last.listType === 'ul') {
        last.items.push(block);
      } else {
        grouped.push({ type: 'list', listType: 'ul', items: [block] });
      }
    } else if (block.type === 'numbered_list_item') {
      const last = grouped[grouped.length - 1];
      if (last?.type === 'list' && last.listType === 'ol') {
        last.items.push(block);
      } else {
        grouped.push({ type: 'list', listType: 'ol', items: [block] });
      }
    } else {
      grouped.push({ type: 'block', block });
    }
  }

  const listItemStyle = {
    margin: '0 0 8px 22px',
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 300,
    fontSize: 14.5,
    lineHeight: 2.15,
    color: 'var(--rs-slate1)',
  };

  return (
    <div style={{ overflowWrap: 'break-word' }}>
      {grouped.map((item, i) => {
        if (item.type === 'list') {
          const Tag = item.listType === 'ol' ? 'ol' : 'ul';
          return (
            <Tag key={i} style={{ margin: '0 0 18px', padding: 0, listStylePosition: 'outside' }}>
              {item.items.map((block) => (
                <li key={block.id} style={{ ...listItemStyle, listStyleType: item.listType === 'ol' ? 'decimal' : 'disc' }}>
                  <RichText text={block.type === 'bulleted_list_item' ? (block as any).bulleted_list_item.rich_text : (block as any).numbered_list_item.rich_text} />
                </li>
              ))}
            </Tag>
          );
        }
        return <div key={item.block.id}>{renderBlock(item.block)}</div>;
      })}
    </div>
  );
}
