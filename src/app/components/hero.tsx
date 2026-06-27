import s from "./hero.module.css";
import LogoSvg from "./LogoSvg";

export default function Hero() {
  return (
    <header id="top" data-reveal className={s.hero}>
      <div className={s.eyebrow}>
        <span className={s.eyebrowStar}>✦</span>
        <span>musician&#8202;-&#8202;sound artist</span>
        <span className={s.eyebrowLine} />
        <span>jp</span>
      </div>

      <div>
        <LogoSvg className={s.logo} />
      </div>

      <div className={s.leadRow}>
        <p className={s.leadEn}>
          drawn to everything sound can touch — the named and the nameless alike.
        </p>
        
      </div>

      <div className={s.sparkleRight}>✦</div>
      <div className={s.sparkleLeft}>✦</div>
    </header>
  );
}
