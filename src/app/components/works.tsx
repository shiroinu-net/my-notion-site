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
      <SectionHeader title="Works" no="03" label="releases & projects" marginBottom="24px" />

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
