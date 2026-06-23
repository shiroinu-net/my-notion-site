import Image from "next/image";
import s from "./hero.module.css";

export default function Hero() {
  return (
    <header id="top" data-reveal className={s.hero}>
      <div className={s.eyebrow}>
        <span className={s.eyebrowStar}>✦</span>
        <span>singer&#8202;-&#8202;songwriter</span>
        <span className={s.eyebrowLine} />
        <span>nagoya, jp</span>
      </div>

      <div>
        <Image
          src="/logo.svg"
          alt="Rishao"
          width={480}
          height={241}
          priority
          className={s.logo}
        />
      </div>

      <div className={s.leadRow}>
        <p className={s.leadEn}>
          a love for nameless phenomena, sung in cool, drifting electro&#8202;-&#8202;pop.
        </p>
        
      </div>

      <div className={s.sparkleRight}>✦</div>
      <div className={s.sparkleLeft}>✦</div>
    </header>
  );
}
