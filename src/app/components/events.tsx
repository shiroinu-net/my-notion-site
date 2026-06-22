import Link from 'next/link';
import { getDatabasePages, getRichTextContent } from '../../../lib/notion';

export const revalidate = 60;

export default async function Events() {
  const pages = await getDatabasePages(5);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('T')[0].split('-');
    return `${y} · ${m} · ${d}`;
  };

  return (
    <section
      id="events"
      data-reveal
      style={{
        position: "relative",
        zIndex: 5,
        padding: "clamp(64px,11vh,140px) clamp(24px,5vw,72px)",
        maxWidth: 1280,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 18,
          marginBottom: "clamp(34px,6vh,64px)",
        }}
      >
        <span style={{ fontSize: 16, color: "var(--rs-lilac)" }}>✦</span>
        <h2
          style={{
            margin: 0,
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 500,
            fontStyle: "italic",
            fontSize: "clamp(34px,5vw,58px)",
            color: "var(--rs-ink)",
            lineHeight: 1,
          }}
        >
          Events
        </h2>
        <span
          style={{
            flex: 1,
            height: 1,
            background: "linear-gradient(to right, var(--rs-slate4), transparent)",
            opacity: 0.5,
            alignSelf: "center",
            marginLeft: 8,
          }}
        />
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            letterSpacing: ".2em",
            color: "var(--rs-violet)",
          }}
        >
          02 — live
        </span>
      </div>

      {/* Event list */}
      {pages.map((page) => {
        const titleProp = page.properties.Title;
        const placeProp = page.properties.Place;
        const dateProp  = page.properties.Date;
        const checkProp = page.properties.check;

        if (checkProp && 'checkbox' in checkProp && !checkProp.checkbox) return null;

        const title = titleProp && 'title' in titleProp ? getRichTextContent(titleProp.title) : 'Untitled';
        const place = placeProp && 'rich_text' in placeProp ? getRichTextContent(placeProp.rich_text) : '';

        let dateStr = '';
        if (dateProp && 'date' in dateProp && dateProp.date) {
          dateStr = formatDate(dateProp.date.start);
        }

        return (
          <Link
            key={page.id}
            href={`/posts/${page.id}`}
            style={{
              display: "grid",
              gridTemplateColumns: "140px minmax(0,1fr) auto",
              gap: "clamp(16px,3vw,40px)",
              alignItems: "center",
              padding: "clamp(20px,3vh,30px) 8px",
              borderTop: "1px solid rgba(110,134,155,.28)",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 13,
                letterSpacing: ".04em",
                color: "var(--rs-slate3)",
              }}
            >
              {dateStr}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Noto Serif JP', serif",
                  fontWeight: 400,
                  fontSize: "clamp(17px,2vw,22px)",
                  color: "var(--rs-ink)",
                  lineHeight: 1.4,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: 16,
                  color: "var(--rs-violet)",
                  marginTop: 4,
                }}
              >
                {place}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                letterSpacing: ".12em",
                color: "var(--rs-slate4)",
              }}
            >
              <span style={{ fontSize: 18, color: "var(--rs-slate3)" }}>→</span>
            </div>
          </Link>
        );
      })}

      <div
        style={{
          borderTop: "1px solid rgba(110,134,155,.28)",
          marginTop: 0,
          paddingTop: 22,
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          letterSpacing: ".1em",
          color: "var(--rs-slate4)",
          fontStyle: "italic",
        }}
      >
        — upcoming dates update automatically.
      </div>
    </section>
  );
}
