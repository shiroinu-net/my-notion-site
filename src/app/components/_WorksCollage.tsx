// 退避中のコラージュブロック（works.tsx で使う場合は import してセクションヘッダーの下に置く）
// import WorksCollage from './_WorksCollage';
// import s from './works.module.css';

import s from './works.module.css';

export default function WorksCollage() {
  return (
    <div className={s.collage}>
      {/* 中央の巨大な "uzu" */}
      <div className={s.bigWord}>
        <span>uzu</span>
      </div>

      {/* 左上：丸フレーム */}
      <div className={s.frameCircle}>
        <div className={s.imgCircle} />
        <div className={s.caption}>
          渦 / uzu
          <br />
          <span className={s.captionMeta}>EP · 2025</span>
        </div>
      </div>

      {/* 右上：リキッドなブロブ */}
      <div className={s.frameBlobTop}>
        <div className={s.imgBlobTop} />
      </div>

      {/* 下：ピル型 */}
      <div className={s.framePill}>
        <div className={s.imgPill} />
      </div>

      {/* 右下：小さなブロブ */}
      <div className={s.frameBlobSmall}>
        <div className={s.imgBlobSmall} />
        <div className={`${s.caption} ${s.captionRight}`}>
          水際 / minagiwa
          <br />
          <span className={s.captionMeta}>single · 2024</span>
        </div>
      </div>

      {/* 装飾 */}
      <div className={s.sparkle1}>✦</div>
      <div className={s.sparkle2}>✦</div>

      {/* 渦の SVG */}
      <svg viewBox="0 0 100 100" className={s.swirl}>
        <path
          d="M50 50 m0 0 C50 38 62 38 62 50 C62 66 42 66 42 50 C42 30 70 30 70 50 C70 74 34 74 34 50 C34 26 78 26 78 50"
          fill="none"
          stroke="var(--rs-slate4)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
