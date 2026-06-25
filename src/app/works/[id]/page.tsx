import { getPageBlocks, getWorksPages, getWorkData, coverImagePath } from '../../../../lib/notion';
import Link from 'next/link';
import EventRenderer from '../../events/[id]/event-renderer';

export const revalidate = 60;

export async function generateStaticParams() {
  const pages = await getWorksPages();
  return pages.map((page) => ({ id: page.id }));
}

// 日付フォーマット: 2026 · 06 · 22
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const [y, m, d] = dateString.split('T')[0].split('-');
  return [y, m, d].filter(Boolean).join(' · ');
};

export default async function WorkPage({ params }: { params: { id: string } }) {
  const pageId = params.id;
  const blocks = await getPageBlocks(pageId);
  const pages = await getWorksPages();
  const currentPage = pages.find((page) => page.id === pageId);

  if (!currentPage) {
    return (
      <main
        style={{
          position: 'relative',
          zIndex: 5,
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(28px,5vw,44px)',
              color: 'var(--rs-ink)',
              marginBottom: 18,
            }}
          >
            Work not found
          </h1>
          <Link
            href="/#works"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              letterSpacing: '.12em',
              color: 'var(--rs-violet)',
            }}
          >
            ← back to works
          </Link>
        </div>
      </main>
    );
  }

  const w = getWorkData(currentPage);
  const dateStr = formatDate(w.date);
  const metaLine = [w.type, w.date ? w.date.split('-')[0] : ''].filter(Boolean).join(' · ');

  const streaming = [
    { label: 'Spotify', url: w.links.spotify },
    { label: 'Apple Music', url: w.links.appleMusic },
    { label: 'Bandcamp', url: w.links.bandcamp },
    { label: 'YouTube', url: w.links.youtube },
  ].filter((l) => l.url);

  return (
    <main
      style={{
        position: 'relative',
        zIndex: 5,
        maxWidth: 880,
        margin: '0 auto',
        padding: 'clamp(96px,14vh,160px) clamp(24px,5vw,72px) clamp(64px,11vh,120px)',
        boxSizing: 'border-box',
      }}
    >
      {/* パンくず */}
      <nav
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          letterSpacing: '.14em',
          marginBottom: 'clamp(40px,7vh,72px)',
        }}
      >
        <span style={{ color: 'var(--rs-slate3)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 16 }}>←</span>
          <span>back to...</span>
        </span>
        <Link href="/" style={{ color: 'var(--rs-slate3)', textDecoration: 'none' }}>
          Home
        </Link>
        <span style={{ color: 'var(--rs-slate4)' }}>/</span>
        <Link href="/works" style={{ color: 'var(--rs-violet)', textDecoration: 'none' }}>
          all works
        </Link>
      </nav>

      {/* 作品ヘッダー */}
      <header style={{ marginBottom: 'clamp(40px,7vh,72px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
          <span style={{ fontSize: 15, color: 'var(--rs-lilac)' }}>✦</span>
          {metaLine && (
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 13,
                letterSpacing: '.06em',
                color: 'var(--rs-slate3)',
              }}
            >
              {metaLine}
            </span>
          )}
        </div>

        {/* ジャケット */}
        {w.hasCover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImagePath(w.id)}
            alt={w.title}
            style={{
              width: '100%',
              maxWidth: 420,
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              borderRadius: 12,
              display: 'block',
              marginBottom: 32,
              boxShadow: '0 18px 50px -28px rgba(58,70,84,.5)',
            }}
          />
        )}

        <h1
          style={{
            margin: 0,
            fontFamily: "'Noto Serif JP', serif",
            fontWeight: 400,
            fontSize: 'clamp(30px,5.4vw,56px)',
            color: 'var(--rs-ink)',
            lineHeight: 1.3,
            letterSpacing: '.01em',
          }}
        >
          {w.title}
        </h1>

        {/* ローマ字 / レーベル */}
        {(w.romaji || w.label) && (
          <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
            {w.romaji && (
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: 22,
                  color: 'var(--rs-violet)',
                }}
              >
                {w.romaji}
              </span>
            )}
            {w.label && (
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  letterSpacing: '.1em',
                  color: 'var(--rs-slate4)',
                }}
              >
                {w.label}
              </span>
            )}
          </div>
        )}

        {/* 配信リンク */}
        {streaming.length > 0 && (
          <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {streaming.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: 'var(--rs-violet)',
                  border: '1px solid rgba(131,122,160,.4)',
                  borderRadius: 999,
                  padding: '9px 18px',
                  textDecoration: 'none',
                }}
              >
                ↗ {l.label}
              </a>
            ))}
          </div>
        )}

        {/* 区切り線 */}
        <span
          style={{
            display: 'block',
            height: 1,
            marginTop: 'clamp(34px,6vh,56px)',
            background: 'linear-gradient(to right, var(--rs-slate4), transparent)',
            opacity: 0.5,
          }}
        />
      </header>

      {/* 本文（解説・トラックリスト・クレジット） */}
      <article>
        <EventRenderer blocks={blocks} />
      </article>

      {/* フッターの戻り導線 */}
      <div
        style={{
          marginTop: 'clamp(56px,9vh,96px)',
          paddingTop: 24,
          borderTop: '1px solid rgba(110,134,155,.28)',
        }}
      >
        <Link
          href="/works"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            letterSpacing: '.12em',
            fontStyle: 'italic',
            color: 'var(--rs-slate4)',
          }}
        >
          ← all works
        </Link>
      </div>
    </main>
  );
}
