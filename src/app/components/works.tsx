import Link from "next/link";
import SectionHeader from "./SectionHeader";
import {
  getWorksPages,
  getWorkData,
  publishedSortedWorks,
  coverImagePath,
} from "../../../lib/notion";
import s from "./works.module.css";

export const revalidate = 60;

export default async function Works() {
  const pages = await getWorksPages();
  const works = publishedSortedWorks(pages).slice(0, 4).map(getWorkData);

  const year = (date: string) => (date ? date.split("-")[0] : "");
  const metaLine = (type: string, date: string) =>
    [type, year(date)].filter(Boolean).join(" · ");

  return (
    <section id="works" data-reveal className={s.section}>
      <SectionHeader title="Works" no="03" label="release" marginBottom="24px" />

      {/* エディトリアルなコラージュ（メイン音源の PR 枠：手動管理） */}
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

      {/* Releases / Works 一覧（Notion 駆動・最新4件） */}
      <div className={s.archive}>
        <div className={s.archiveHead}>
          <span className={s.archiveLabel}>discography &amp; works</span>
          <span className={s.archiveRule} />
        </div>

        {works.map((w) => (
          <Link key={w.id} href={`/works/${w.id}`} className={s.row}>
            <div className={s.thumb}>
              {w.hasCover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverImagePath(w.id)} alt={w.title} className={s.thumbImg} />
              ) : (
                <div className={s.thumbPlaceholder} />
              )}
            </div>
            <div className={s.rowMain}>
              <div className={s.rowTitle}>{w.title}</div>
              {w.romaji && <div className={s.rowRomaji}>{w.romaji}</div>}
            </div>
            <div className={s.rowMeta}>{metaLine(w.type, w.date)}</div>
            <div className={s.rowArrow}>→</div>
          </Link>
        ))}

        <div className={s.footer}>
          <span>— full discography updates from Notion.</span>
          <Link href="/works" className={s.viewAll}>
            view all <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
