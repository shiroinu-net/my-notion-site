import Link from 'next/link';
import { getDatabasePages, getRichTextContent } from '../../../lib/notion';
import SectionHeader from './SectionHeader';
import s from './events.module.css';

export const revalidate = 60;

export default async function Events() {
  const pages = await getDatabasePages();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('T')[0].split('-');
    return `${y} · ${m} · ${d}`;
  };

  // Date の文字列を取り出すヘルパー（無ければ空文字）
  const getDateStr = (page: (typeof pages)[number]) => {
    const dateProp = page.properties.Date;
    if (dateProp && 'date' in dateProp && dateProp.date) return dateProp.date.start;
    return '';
  };

  // check が false のものを除外 → 日付の新しい順に並べ替え → 最新5件だけ表示
  const events = pages
    .filter((page) => {
      const checkProp = page.properties.check;
      if (checkProp && 'checkbox' in checkProp && !checkProp.checkbox) return false;
      return true;
    })
    .sort((a, b) => getDateStr(b).localeCompare(getDateStr(a)))
    .slice(0, 5);

  return (
    <section id="events" data-reveal className={s.section}>
      <SectionHeader title="Events" no="02" label="upcoming & past" marginBottom="clamp(34px,6vh,64px)" />

      {/* Event list */}
      {events.map((page) => {
        const titleProp = page.properties.Title;
        const placeProp = page.properties.Place;
        const dateProp  = page.properties.Date;

        const title = titleProp && 'title' in titleProp ? getRichTextContent(titleProp.title) : 'Untitled';
        const place = placeProp && 'rich_text' in placeProp ? getRichTextContent(placeProp.rich_text) : '';
        const areaProp = page.properties.Area;
        const area = areaProp && 'formula' in areaProp && areaProp.formula.type === 'string' ? areaProp.formula.string ?? '' : '';

        let dateStr = '';
        if (dateProp && 'date' in dateProp && dateProp.date) {
          dateStr = formatDate(dateProp.date.start);
        }

        return (
          <Link key={page.id} href={`/events/${page.id}`} className={s.row}>
            <div className={s.date}>{dateStr}</div>
            <div className={s.main}>
              <div className={s.title}>{title}</div>
              <div className={s.place}>{place}{area && <span style={{ marginLeft: '0.4em', opacity: 0.7 }}>（{area}）</span>}</div>
            </div>
            <div className={s.arrow}>→</div>
          </Link>
        );
      })}

      <div className={s.footer}>
        <Link href="/events" className={s.viewAll}>
          view all <span>→</span>
        </Link>
      </div>
    </section>
  );
}
