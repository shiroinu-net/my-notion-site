import Link from 'next/link';
import { getWorksPages, getWorkData, publishedSortedWorks, coverImagePath } from '../../../lib/notion';
import s from './page.module.css';
import WorksFooter from './footer';

export const revalidate = 60;

export const metadata = {
  title: 'Works | Rishao',
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
          className={s.row}
        >
          <div className={s.thumb}>
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
          <div className={s.info}>
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
            className={s.meta}
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
          <div className={s.arrow} style={{ fontSize: 18, color: 'var(--rs-slate3)' }}>→</div>
        </Link>
      ))}

      <WorksFooter />
    </main>
  );
}
