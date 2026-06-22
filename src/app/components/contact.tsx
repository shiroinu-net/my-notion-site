export default function Contact() {
  return (
    <section
      id="contact"
      data-reveal
      style={{
        position: "relative",
        zIndex: 5,
        padding: "clamp(60px,10vh,120px) clamp(24px,5vw,72px) clamp(70px,12vh,120px)",
        maxWidth: 1280,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          marginBottom: 38,
        }}
      >
        <span
          style={{
            fontSize: 18,
            color: "var(--rs-lilac)",
            animation: "rs-twinkle 6s ease-in-out infinite",
          }}
        >
          ✦
        </span>
        <h2
          style={{
            margin: 0,
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 500,
            fontStyle: "italic",
            fontSize: "clamp(30px,4.4vw,50px)",
            color: "var(--rs-ink)",
            lineHeight: 1,
          }}
        >
          Contact
        </h2>
        <span
          style={{
            fontSize: 18,
            color: "var(--rs-rose)",
            animation: "rs-twinkle 6s ease-in-out infinite 1s",
          }}
        >
          ✦
        </span>
      </div>

      <div
        style={{
          height: 1,
          background: "linear-gradient(to right, transparent, var(--rs-slate4), transparent)",
          opacity: 0.55,
          marginBottom: 46,
        }}
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 40,
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10.5,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "var(--rs-violet)",
              marginBottom: 14,
            }}
          >
            booking / mail
          </div>
          <a
            href="mailto:contact@rishao.jp"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(26px,4vw,44px)",
              color: "var(--rs-ink)",
              textDecoration: "none",
              letterSpacing: ".01em",
            }}
          >
            contact@rishao.jp
          </a>
          <p
            style={{
              margin: "16px 0 0",
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 300,
              fontSize: 13,
              lineHeight: 1.9,
              color: "var(--rs-slate2)",
              maxWidth: "36ch",
            }}
          >
            ライブ出演・楽曲提供などのご相談はメールにて。折り返しご連絡します。
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            letterSpacing: ".1em",
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "var(--rs-violet)",
              marginBottom: 2,
            }}
          >
            links
          </div>
          {[
            { label: "instagram", href: "#" },
            { label: "youtube",   href: "#" },
            { label: "bandcamp",  href: "#" },
            { label: "spotify",   href: "#" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                color: "var(--rs-slate1)",
                textDecoration: "none",
                display: "flex",
                gap: 12,
              }}
            >
              <span style={{ color: "var(--rs-slate4)" }}>→</span>
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "clamp(56px,10vh,100px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          letterSpacing: ".14em",
          color: "var(--rs-slate4)",
        }}
      >
        <span>© Rishao</span>
        <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 13 }}>▸</span>
          <span style={{ fontSize: 13 }}>▸</span>
          <span style={{ fontSize: 13 }}>▸</span>
        </span>
        <span>nagoya — nameless phenomena</span>
      </div>
    </section>
  );
}
