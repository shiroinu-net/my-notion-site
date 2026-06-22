export default function Profile() {
  return (
    <section
      id="profile"
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
          marginBottom: "clamp(40px,7vh,80px)",
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
          Profile
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
          01 — about
        </span>
      </div>

      {/* 3-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,0.9fr) minmax(0,1.4fr) minmax(0,0.9fr)",
          gap: "clamp(32px,5vw,72px)",
          alignItems: "start",
        }}
      >
        {/* Portrait placeholder */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingTop: 8 }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "1/1",
              borderRadius: "50%",
              border: "1px solid rgba(110,134,155,.35)",
              background: "rgba(159,178,194,0.14)",
            }}
          />
          <p
            style={{
              margin: 0,
              fontFamily: "'Space Mono', monospace",
              fontSize: 10.5,
              letterSpacing: ".12em",
              lineHeight: 1.9,
              color: "var(--rs-slate3)",
              textAlign: "center",
            }}
          >
            図 01 — portrait
            <br />
            <span style={{ fontStyle: "italic", color: "var(--rs-violet)" }}>drop an image</span>
          </p>
        </div>

        {/* Bio */}
        <div>
          <h3
            style={{
              margin: "0 0 22px",
              fontFamily: "'Noto Serif JP', serif",
              fontWeight: 400,
              fontSize: "clamp(19px,2.2vw,24px)",
              lineHeight: 1.7,
              color: "var(--rs-ink)",
            }}
          >
            水のような旋律で、<br />世界と現象を愛おしむ。
          </h3>
          <p
            style={{
              margin: "0 0 18px",
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 300,
              fontSize: 14.5,
              lineHeight: 2.15,
              color: "var(--rs-slate1)",
              maxWidth: "46ch",
            }}
          >
            名古屋を拠点に活動するシンガーソングライター。幼少期よりピアノ、中学から打楽器を始める。国立音楽大学で打楽器を専攻し、クラシックや現代音楽を学ぶ。パフォーマンススタイルにデジタルパーカッションを取り入れ、現在はソロライブや楽曲制作を行う。
          </p>
          <p
            style={{
              margin: "0 0 28px",
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 300,
              fontSize: 14.5,
              lineHeight: 2.15,
              color: "var(--rs-slate1)",
              maxWidth: "46ch",
            }}
          >
            名を持たぬ現象とそれを内在する世界への愛と、個人の文化的独自性の探求を基に音楽という形で表現を重ね、広い音楽ルーツをベースとした多文化的なエレクトロ・ポップサウンドで定評を得る。2023年、初となるEP「mo:yu」をリリース。
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(18px,2vw,23px)",
              lineHeight: 1.5,
              color: "var(--rs-slate3)",
              maxWidth: "40ch",
            }}
          >
            "a love for nameless phenomena and the world they inhabit — multicultural electro-pop from Nagoya."
          </p>
        </div>

        {/* Spec */}
        <div style={{ fontFamily: "'Space Mono', monospace", color: "var(--rs-slate2)", paddingTop: 6 }}>
          <div
            style={{
              fontSize: 10.5,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "var(--rs-violet)",
              marginBottom: 20,
            }}
          >
            spec
          </div>
          <dl
            style={{
              margin: 0,
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "14px 16px",
              fontSize: 12,
              lineHeight: 1.7,
            }}
          >
            <dt style={{ color: "var(--rs-slate4)", letterSpacing: ".08em" }}>based</dt>
            <dd style={{ margin: 0, color: "var(--rs-slate1)" }}>Nagoya, JP</dd>
            <dt style={{ color: "var(--rs-slate4)", letterSpacing: ".08em" }}>genre</dt>
            <dd style={{ margin: 0, color: "var(--rs-slate1)" }}>multicultural<br />electro&#8202;-&#8202;pop</dd>
            <dt style={{ color: "var(--rs-slate4)", letterSpacing: ".08em" }}>theme</dt>
            <dd style={{ margin: 0, color: "var(--rs-slate1)" }}>love for nameless<br />phenomena</dd>
            <dt style={{ color: "var(--rs-slate4)", letterSpacing: ".08em" }}>setup</dt>
            <dd style={{ margin: 0, color: "var(--rs-slate1)" }}>solo&#8202;-&#8202;set /<br />electro band</dd>
            <dt style={{ color: "var(--rs-slate4)", letterSpacing: ".08em" }}>lang</dt>
            <dd style={{ margin: 0, color: "var(--rs-slate1)" }}>JP / EN</dd>
          </dl>
          <div style={{ marginTop: 26, fontSize: 18, color: "var(--rs-rose)" }}>✦</div>
        </div>
      </div>
    </section>
  );
}
