import s from "./contact.module.css";

const LINKS = [
  { label: "instagram", href: "#" },
  { label: "youtube", href: "#" },
  { label: "bandcamp", href: "#" },
  { label: "spotify", href: "#" },
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
          <a href="mailto:rishao.contact@gmail.com" className={s.mail}>
            rishao.contact@gmail.com
          </a>
          <p className={s.note}>
            ライブ出演・楽曲提供などのご相談はメールにて。折り返しご連絡します。
          </p>
        </div>

        {/* 右：リンク一覧 */}
        <div className={s.links}>
          <div className={`${s.kicker} ${s.linksKicker}`}>links</div>
          {LINKS.map(({ label, href }) => (
            <a key={label} href={href} className={s.link}>
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
        <span>nagoya — nameless phenomena</span>
      </div>
    </section>
  );
}
