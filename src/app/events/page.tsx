import Link from 'next/link';
import { getDatabasePages, getRichTextContent } from '../../../lib/notion';

export const revalidate = 60;

export const metadata = {
  title: 'Events — Rishao',
  description: 'All live dates and events.',
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const [y, m, d] = dateString.split('T')[0].split('-');
  return `${y} · ${m} · ${d}`;
};

export default async function EventsArchive() {
  const pages = await getDatabasePages();

  const getDateStr = (page: (typeof pages)[number]) => {
    const dateProp = page.properties.Date;
    if (dateProp && 'date' in dateProp && dateProp.date) return dateProp.date.start;
    return '';
  };

  // check が false のものは除外 → 日付の新しい順に並べ替え（全件）
  const events = pages
    .filter((page) => {
      const checkProp = page.properties.check;
      if (checkProp && 'checkbox' in checkProp && !checkProp.checkbox) return false;
      return true;
    })
    .sort((a, b) => getDateStr(b).localeCompare(getDateStr(a)));

  return (
    <main
      style={{
        position: 'relative',
        zIndex: 5,
        maxWidth: 1080,
        margin: '0 auto',
        padding: 'clamp(96px,14vh,160px) clamp(24px,5vw,72px) clamp(64px,11vh,120px)',
        boxSizing: 'border-box',
      }}
    >
      {/* 戻りリンク */}
      <Link
        href="/#events"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          letterSpacing: '.18em',
          color: 'var(--rs-slate3)',
          marginBottom: 'clamp(40px,7vh,72px)',
        }}
      >
        <span style={{ fontSize: 16 }}>←</span> back to home
      </Link>

      {/* セクションヘッダー（Events セクションと同じ構成） */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 18,
          marginBottom: 'clamp(34px,6vh,64px)',
        }}
      >
        <span style={{ fontSize: 16, color: 'var(--rs-lilac)' }}>✦</span>
        <h1
          style={{
            margin: 0,
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 500,
            fontStyle: 'italic',
            fontSize: 'clamp(34px,5vw,58px)',
            color: 'var(--rs-ink)',
            lineHeight: 1,
          }}
        >
          Events
        </h1>
        <span
          style={{
            flex: 1,
            height: 1,
            background: 'linear-gradient(to right, var(--rs-slate4), transparent)',
            opacity: 0.5,
            alignSelf: 'center',
            marginLeft: 8,
          }}
        />
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            letterSpacing: '.2em',
            color: 'var(--rs-violet)',
          }}
        >
          archive — {String(events.length).padStart(2, '0')}
        </span>
      </div>

      {/* イベント一覧（全件） */}
      {events.map((page) => {
        const titleProp = page.properties.Title;
        const placeProp = page.properties.Place;
        const dateProp = page.properties.Date;

        const title = titleProp && 'title' in titleProp ? getRichTextContent(titleProp.title) : 'Untitled';
        const place = placeProp && 'rich_text' in placeProp ? getRichTextContent(placeProp.rich_text) : '';
        const areaProp = page.properties.Area;
        const area = areaProp && 'formula' in areaProp && areaProp.formula.type === 'string' ? areaProp.formula.string ?? '' : '';

        let dateStr = '';
        if (dateProp && 'date' in dateProp && dateProp.date) {
          dateStr = formatDate(dateProp.date.start);
        }

        return (
          <Link
            key={page.id}
            href={`/events/${page.id}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '140px minmax(0,1fr) auto',
              gap: 'clamp(16px,3vw,40px)',
              alignItems: 'center',
              padding: 'clamp(20px,3vh,30px) 8px',
              borderTop: '1px solid rgba(110,134,155,.28)',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 13,
                letterSpacing: '.04em',
                color: 'var(--rs-slate3)',
              }}
            >
              {dateStr}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Noto Serif JP', serif",
                  fontWeight: 400,
                  fontSize: 'clamp(17px,2vw,22px)',
                  color: 'var(--rs-ink)',
                  lineHeight: 1.4,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: 16,
                  color: 'var(--rs-violet)',
                  marginTop: 4,
                }}
              >
                {place}{area && <span style={{ marginLeft: '0.4em', opacity: 0.7 }}>（{area}）</span>}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                letterSpacing: '.12em',
                color: 'var(--rs-slate4)',
              }}
            >
              <span style={{ fontSize: 18, color: 'var(--rs-slate3)' }}>→</span>
            </div>
          </Link>
        );
      })}

      <div
        style={{
          borderTop: '1px solid rgba(110,134,155,.28)',
          paddingTop: 22,
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          letterSpacing: '.1em',
          color: 'var(--rs-slate4)',
          fontStyle: 'italic',
        }}
      >
        — that&apos;s all, for now.
      </div>
    </main>
  );
}
