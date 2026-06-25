import s from "./contact.module.css";

const LINKS = [
  { label: "instagram", href: "https://www.instagram.com/rishao_" },
  { label: "youtube", href: "https://www.youtube.com/@rishao1765" },
  { label: "bandcamp", href: "https://rishao.bandcamp.com/" },
   { label: "applemusic", href: "https://music.apple.com/jp/artist/rishao/" },
  { label: "spotify", href: "https://open.spotify.com/intl-ja/artist/5TBc2GgVHNTiYKwBJ1LDmV" },
];

export default function Contact() {
  return (
    <section id="contact" data-reveal className={s.section}>
      {/* 中央寄せの見出し */}
      <div className={s.header}>
        <span className={s.starLeft}>✦</span>
        <h2 className={s.title}>Contact</h2>
        <span className={s.starRight}>✦</span>
      </div>

      <div className={s.rule} />

      <div className={s.columns}>
        {/* 左：メール */}
        <div>
          <div className={s.kicker}>booking / mail</div>
          <a href="mailto:rishao.contact@gmail.com" className={s.mail} target="_blank" rel="noopener noreferrer">
            rishao.contact@gmail.com
          </a>
          <p className={s.note}>
            For inquiries regarding live performances, collaborations,
            and music production, feel free to reach out.
            <span className={s.noteJa}>
              ライブ出演・コラボレーション・制作などのご相談はこちらから。
            </span>
          </p>
        </div>

        {/* 右：リンク一覧 */}
        <div className={s.links}>
          <div className={`${s.kicker} ${s.linksKicker}`}>links</div>
          {LINKS.map(({ label, href }) => (
            <a key={label} href={href} className={s.link} target="_blank" rel="noopener noreferrer">
              <span>→</span>
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* フッター */}
      <div className={s.footer}>
        <span>© Rishao</span>
        <span className={s.footerDots}>
          <span>▸</span>
          <span>▸</span>
          <span>▸</span>
        </span>
      </div>
    </section>
  );
}
