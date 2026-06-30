import { getPageBlocks, getDatabasePages, getRichTextContent } from '../../../../lib/notion';
import Link from 'next/link';
import EventRenderer from './event-renderer';

export const revalidate = 60;

export async function generateStaticParams() {
  const pages = await getDatabasePages();
  return pages.map((page) => ({
    id: page.id,
  }));
}

// ヘルパー: プロパティからテキストを安全に取得
const getTextFromProp = (
  page: any,
  propName: string,
  type: 'rich_text' | 'title' | 'select' | 'status' | 'formula' = 'rich_text'
) => {
  const prop = page.properties[propName];
  if (!prop) return '';
  if (type === 'rich_text' || type === 'title') return getRichTextContent(prop[type] || []);
  if (type === 'select') return prop.select?.name || '';
  if (type === 'status') return prop.status?.name || '';
  if (type === 'formula') return prop.formula?.string || prop.formula?.number?.toString() || '';
  return '';
};

// 日付フォーマット: 2026 · 06 · 22 (Events セクションと同じ表記)
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const datePart = dateString.split('T')[0];
  const timePart = dateString.includes('T') ? dateString.split('T')[1].substring(0, 5) : '';
  const [y, m, d] = datePart.split('-');
  const dateLabel = `${y} · ${m} · ${d}`;
  return timePart ? `${dateLabel} · ${timePart}` : dateLabel;
};

export async function generateMetadata({ params }: { params: { id: string } }) {
  const pages = await getDatabasePages();
  const currentPage = pages.find((page) => page.id === params.id);
  const title = currentPage
    ? getTextFromProp(currentPage, 'Title', 'title') || 'Untitled Event'
    : 'Event not found';
  return { title: `${title} | Rishao` };
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const pageId = params.id;
  const blocks = await getPageBlocks(pageId);
  const pages = await getDatabasePages();
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
            Event not found
          </h1>
          <Link
            href="/#events"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              letterSpacing: '.12em',
              color: 'var(--rs-violet)',
            }}
          >
            ← back to events
          </Link>
        </div>
      </main>
    );
  }

  // --- プロパティ取得 ---
  const title = getTextFromProp(currentPage, 'Title', 'title') || 'Untitled Event';

  // Status (select / status 両対応 + ラベル整形)
  let statusRaw =
    getTextFromProp(currentPage, 'Status', 'select') || getTextFromProp(currentPage, 'Status', 'status');
  let statusLabel = statusRaw;
  if (statusRaw === '2..comming') statusLabel = 'coming';
  if (statusRaw === '3..archive') statusLabel = 'archive';

  const placeText = getTextFromProp(currentPage, 'Place', 'rich_text');
  const areaText = getTextFromProp(currentPage, 'Area', 'formula');
  const addressText = getTextFromProp(currentPage, 'Address', 'rich_text');
  const mapQuery = addressText || placeText;
  const mapUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
    : null;

  // 日付
  const dateProperty = currentPage.properties.Date;
  let dateStr = '';
  if (dateProperty && 'date' in dateProperty && dateProperty.date) {
    const { start, end } = dateProperty.date;
    const startFmt = formatDate(start);
    const endFmt = end ? formatDate(end) : null;
    dateStr = endFmt ? `${startFmt} → ${endFmt}` : startFmt;
  }

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
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, color: 'var(--rs-slate3)' }}>←</span>
          <Link href="/" style={{ color: 'var(--rs-slate3)' }}>back to home</Link>
        </span>
        <span style={{ color: 'var(--rs-slate4)' }}>/</span>
        <Link href="/events" style={{ color: 'var(--rs-violet)' }}>all events</Link>
      </nav>

      {/* イベントヘッダー */}
      <header style={{ marginBottom: 'clamp(40px,7vh,72px)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 26,
          }}
        >
          <span style={{ fontSize: 15, color: 'var(--rs-lilac)' }}>✦</span>
          {dateStr && (
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 13,
                letterSpacing: '.06em',
                color: 'var(--rs-slate3)',
              }}
            >
              {dateStr}
            </span>
          )}
          {statusLabel && (
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: 'var(--rs-violet)',
                border: '1px solid rgba(131,122,160,.4)',
                borderRadius: 999,
                padding: '4px 12px',
              }}
            >
              {statusLabel}
            </span>
          )}
        </div>

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
          {title}
        </h1>

        {/* 会場 / 住所 */}
        {(placeText || addressText) && (
          <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 14 }}>
            {placeText && (
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: 22,
                  color: 'var(--rs-violet)',
                }}
              >
                {placeText}{areaText && <span style={{ fontSize: 16, color: 'var(--rs-slate3)' }}>（{areaText}）</span>}
              </span>
            )}
            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  letterSpacing: '.1em',
                  color: 'var(--rs-slate3)',
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                }}
              >
                ↗ map
              </a>
            )}
            {addressText && (
              <span
                style={{
                  width: '100%',
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontWeight: 300,
                  fontSize: 13,
                  color: 'var(--rs-slate4)',
                }}
              >
                {addressText}
              </span>
            )}
          </div>
        )}

        {/* 区切り線 (Events セクションのトーンに合わせたグラデ) */}
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

      {/* 本文 */}
      <article>
        <EventRenderer blocks={blocks} />
      </article>

      {/* フッターの戻り導線 */}
      <div
        style={{
          marginTop: 'clamp(56px,9vh,96px)',
          paddingTop: 24,
          borderTop: '1px solid rgba(110,134,155,.28)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          href="/events"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            letterSpacing: '.12em',
            fontStyle: 'italic',
            color: 'var(--rs-slate4)',
          }}
        >
          ← all events
        </Link>
        <a
          href="#"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            letterSpacing: '.12em',
            fontStyle: 'italic',
            color: 'var(--rs-slate4)',
          }}
        >
          ↑ top
        </a>
      </div>
    </main>
  );
}
