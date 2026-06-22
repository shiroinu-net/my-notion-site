export default function Works() {
  return (
    <section
      id="works"
      data-reveal
      style={{
        position: "relative",
        zIndex: 5,
        padding: "clamp(40px,7vh,90px) clamp(24px,5vw,72px) clamp(70px,12vh,150px)",
        maxWidth: 1320,
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
          marginBottom: 24,
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
          Works
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
          03 — release
        </span>
      </div>

      {/* Editorial collage */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(520px,72vh,820px)",
        }}
      >
        {/* Giant "uzu" word */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "46%",
            transform: "translate(-50%,-50%)",
            width: "100%",
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <span
            style={{
              display: "inline-block",
              transform: "scaleY(1.5)",
              transformOrigin: "center",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
              fontSize: "clamp(80px,18vw,250px)",
              lineHeight: 0.8,
              letterSpacing: ".02em",
              color: "var(--rs-slate3)",
              opacity: 0.92,
            }}
          >
            uzu
          </span>
        </div>

        {/* Circle frame — top left */}
        <div
          style={{
            position: "absolute",
            left: "2%",
            top: "4%",
            width: "clamp(140px,17vw,230px)",
            zIndex: 3,
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "1/1",
              borderRadius: "50%",
              border: "1px solid rgba(110,134,155,.3)",
              background: "rgba(159,178,194,0.14)",
            }}
          />
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 15,
              color: "var(--rs-slate1)",
              marginTop: 10,
              lineHeight: 1.3,
            }}
          >
            渦 / uzu
            <br />
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontStyle: "normal",
                fontSize: 10,
                letterSpacing: ".12em",
                color: "var(--rs-slate4)",
              }}
            >
              EP · 2025
            </span>
          </div>
        </div>

        {/* Liquid blob frame — top right */}
        <div
          style={{
            position: "absolute",
            right: "1%",
            top: 0,
            width: "clamp(220px,30vw,400px)",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "4/3",
              borderRadius: "54% 46% 63% 37% / 42% 56% 44% 58%",
              overflow: "hidden",
              boxShadow: "0 18px 50px -28px rgba(58,70,84,.5)",
              background: "rgba(159,178,194,0.14)",
            }}
          />
        </div>

        {/* Pill frame — bottom */}
        <div
          style={{
            position: "absolute",
            left: "8%",
            bottom: "2%",
            width: "clamp(280px,46vw,640px)",
            zIndex: 3,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "clamp(120px,18vh,180px)",
              borderRadius: 9999,
              border: "1px solid rgba(110,134,155,.3)",
              background: "rgba(159,178,194,0.14)",
            }}
          />
        </div>

        {/* Small blob — bottom right */}
        <div
          style={{
            position: "absolute",
            right: "6%",
            bottom: "6%",
            width: "clamp(130px,16vw,210px)",
            zIndex: 3,
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "3/4",
              borderRadius: "46% 54% 38% 62% / 56% 41% 59% 44%",
              overflow: "hidden",
              boxShadow: "0 16px 40px -26px rgba(58,70,84,.5)",
              background: "rgba(159,178,194,0.14)",
            }}
          />
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 14,
              color: "var(--rs-slate1)",
              marginTop: 8,
              textAlign: "right",
            }}
          >
            水際 / minagiwa
            <br />
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontStyle: "normal",
                fontSize: 10,
                letterSpacing: ".12em",
                color: "var(--rs-slate4)",
              }}
            >
              single · 2024
            </span>
          </div>
        </div>

        {/* Sparkles */}
        <div
          style={{
            position: "absolute",
            left: "34%",
            top: "8%",
            fontSize: 20,
            color: "var(--rs-rose)",
            zIndex: 4,
            animation: "rs-twinkle 5.5s ease-in-out infinite",
          }}
        >
          ✦
        </div>
        <div
          style={{
            position: "absolute",
            right: "30%",
            bottom: "24%",
            fontSize: 15,
            color: "var(--rs-lilac)",
            zIndex: 4,
            animation: "rs-twinkle 7s ease-in-out infinite 1.2s",
          }}
        >
          ✦
        </div>

        {/* Uzu swirl SVG */}
        <svg
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            left: "24%",
            bottom: "30%",
            width: "clamp(70px,9vw,120px)",
            height: "clamp(70px,9vw,120px)",
            zIndex: 2,
            opacity: 0.5,
          }}
        >
          <path
            d="M50 50 m0 0 C50 38 62 38 62 50 C62 66 42 66 42 50 C42 30 70 30 70 50 C70 74 34 74 34 50 C34 26 78 26 78 50"
            fill="none"
            stroke="var(--rs-slate4)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  );
}
