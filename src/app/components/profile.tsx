import Image from "next/image";
import SectionHeader from "./SectionHeader";
import s from "./profile.module.css";

export default function Profile() {
  return (
    <section id="profile" data-reveal className={s.section}>
      <SectionHeader title="Profile" no="01" label="who's rishao" />

      <div className={s.grid}>
        {/* 左：ポートレート */}
        <div className={s.portrait}>
          <div className={s.portraitFrame}>
            <Image
              src="/profile.jpg"
              alt="Rishao portrait"
              fill
              sizes="(max-width: 680px) 300px, (max-width: 980px) 28vw, 22vw"
              className={s.portraitImg}
            />
          </div>
          <p className={s.portraitCaption}>furry friend — mone</p>
        </div>

        {/* 中央：日本語本文 */}
        <div className={s.jpCol}>
          <div className={s.nameBlock}>
            <h3 className={s.name}>Rishao</h3>
            <span className={s.igName}>リーシャオ</span>
          </div>

          {/* モバイルのみ：名前の直下に表示 */}
          <a
            href="https://www.instagram.com/rishao_/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${s.igLink} ${s.igLinkMobile}`}
          >
            @rishao_
            <span className={s.igLabel}>Instagram</span>
          </a>

          <p className={s.body}>
            名古屋を拠点に活動する音楽家。幼少期よりピアノ、中学から打楽器を始める。音楽大学で打楽器を専攻。現在はソロの他、パーカッシブデュオ「SONOYO」などで活動。名を持たぬ現象とそれを内在する世界への愛と、個人の文化的独自性の探求を基に音楽という形で表現を重ねる。
          <br className={s.bodyBreak} />
            2023年、EP「mo:yu」をリリース。2025年7月にマテリアルの質感にフォーカスをしたサウンドインスタレーション個展を開催。映像とロケーションにフォーカスをしたクリエイティブチーム「Pixel Collective」、採石場イベント「Sound Pit」企画など、活動の場を広げている。
          </p>

          {/* デスクトップのみ：本文の後に表示 */}
          <a
            href="https://www.instagram.com/rishao_/"
            target="_blank"
            rel="noopener noreferrer"
            className={s.igLink}
          >
            @rishao_
            <span className={s.igLabel}>Instagram</span>
          </a>
        </div>

        {/* 右：英訳 */}
        <div className={s.enBlock}>
          <span className={s.enLabel}>EN</span>
          <p className={s.enBody}>
            A Nagoya-based musician. Started piano in early childhood and
            percussion in junior high, then majored in percussion at music
            college. Currently active both solo and as part of the percussive
            duo &ldquo;SONOYO,&rdquo; among other projects. Built on a love for
            nameless phenomena and the world that holds them, and on a search
            for personal cultural identity, the work takes shape as music.
          <br className={s.bodyBreak} />
            Released the EP &ldquo;mo:yu&rdquo; in 2023, and in July 2025 held a
            solo sound installation focused on the texture of materials.
            Continues to widen its scope — including the film-and-location-focused
            creative team &ldquo;Pixel Collective&rdquo; and the quarry event
            &ldquo;Sound Pit.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
