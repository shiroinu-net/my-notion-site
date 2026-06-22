import Image from "next/image";

export default function Hero() {
  return (
    <header
      id="top"
      data-reveal
      style={{
        position: "relative",
        zIndex: 5,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "120px clamp(24px,5vw,72px) 80px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: "var(--rs-slate3)",
          marginBottom: "clamp(40px,8vh,90px)",
        }}
      >
        <span style={{ color: "var(--rs-lilac)", fontSize: 15 }}>✦</span>
        <span>singer&#8202;-&#8202;songwriter</span>
        <span style={{ width: 46, height: 1, background: "var(--rs-slate4)", opacity: 0.6, display: "inline-block" }} />
        <span>nagoya, jp</span>
      </div>

      <div>
        <Image
          src="/logo.svg"
          alt="Rishao"
          width={480}
          height={241}
          priority
          style={{
            display: "block",
            width: "clamp(200px,30vw,480px)",
            height: "auto",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 32,
          marginTop: "clamp(28px,5vh,60px)",
          maxWidth: 1180,
        }}
      >
        <p
          style={{
            margin: 0,
            maxWidth: "30ch",
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(20px,2.6vw,30px)",
            lineHeight: 1.4,
            color: "var(--rs-slate1)",
          }}
        >
          a love for nameless phenomena, sung in cool, drifting electro&#8202;-&#8202;pop.
        </p>
        <p
          style={{
            margin: 0,
            maxWidth: "24ch",
            fontFamily: "'Noto Sans JP', sans-serif",
            fontWeight: 300,
            fontSize: 14,
            lineHeight: 2.0,
            color: "var(--rs-slate2)",
          }}
        >
          名を持たぬ現象への愛を、<br />
          多文化的なエレクトロ・ポップに。<br />
          名古屋を拠点に歌う。
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          right: "clamp(24px,5vw,72px)",
          top: "46%",
          fontSize: 24,
          color: "var(--rs-lilac)",
          animation: "rs-twinkle 5s ease-in-out infinite",
        }}
      >
        ✦
      </div>
      <div
        style={{
          position: "absolute",
          left: "18%",
          bottom: "14%",
          fontSize: 14,
          color: "var(--rs-slate4)",
          animation: "rs-twinkle 6.5s ease-in-out infinite .8s",
        }}
      >
        ✦
      </div>
    </header>
  );
}
