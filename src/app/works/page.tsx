import Link from 'next/link';
import { getWorksPages, getWorkData, publishedSortedWorks, coverImagePath } from '../../../lib/notion';

export const revalidate = 60;

export const metadata = {
  title: 'Works — Rishao',
  description: 'Discography and works archive.',
};

export default async function WorksArchive() {
  const pages = await getWorksPages();
  const works = publishedSortedWorks(pages).map(getWorkData);

  const year = (date: string) => (date ? date.split('-')[0] : '');
  const metaLine = (type: string, date: string) => [type, year(date)].filter(Boolean).join(' · ');

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
        href="/#works"
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

      {/* セクションヘッダー（Works セクションと同じ構成） */}
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
          Works
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
          archive — {String(works.length).padStart(2, '0')}
        </span>
      </div>

      {/* 作品一覧（全件） */}
      {works.map((w) => (
        <Link
          key={w.id}
          href={`/works/${w.id}`}
          style={{
            display: 'grid',
            gridTemplateColumns: '80px minmax(0,1fr) auto auto',
            gap: 'clamp(16px,3vw,40px)',
            alignItems: 'center',
            padding: 'clamp(18px,2.6vh,26px) 8px',
            borderTop: '1px solid rgba(110,134,155,.28)',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div style={{ width: 80, height: 80 }}>
            {w.hasCover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImagePath(w.id)}
                alt={w.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, display: 'block' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 8,
                  border: '1px solid rgba(110,134,155,.3)',
                  background: 'rgba(159,178,194,.14)',
                }}
              />
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontWeight: 400,
                fontSize: 'clamp(18px,2.2vw,24px)',
                color: 'var(--rs-ink)',
                lineHeight: 1.4,
              }}
            >
              {w.title}
            </div>
            {w.romaji && (
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: 16,
                  color: 'var(--rs-violet)',
                  marginTop: 4,
                }}
              >
                {w.romaji}
              </div>
            )}
          </div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              letterSpacing: '.08em',
              color: 'var(--rs-slate3)',
              whiteSpace: 'nowrap',
            }}
          >
            {metaLine(w.type, w.date)}
          </div>
          <div style={{ fontSize: 18, color: 'var(--rs-slate3)' }}>→</div>
        </Link>
      ))}

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
