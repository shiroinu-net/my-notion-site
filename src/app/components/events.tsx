// src/app/page.tsx
    import Link from 'next/link';
    import { getDatabasePages, getRichTextContent } from '../../../lib/notion'; // lib/notion.tsからインポート

    export const revalidate = 60; // 60秒ごとにISRでデータを再取得 (ビルドは静的だが、データは更新可能)

    export default async function Events() {
      const pages = await getDatabasePages(5); // Notionデータベースのページを取得 (最新5件)

      return (
        <section id="events" className="flex flex-col items-center py-24 px-4 bg-white">
          <h2 className="text-4xl font-bold mb-12 text-gray-900">Events</h2>

          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pages.map((page) => {
              // Notionデータベースのプロパティ名に合わせて調整してください
              const titleProperty = page.properties.Title;
              const descriptionProperty = page.properties.Place;
              const dateProperty = page.properties.Date; // Dateプロパティを取得
              const publishedProperty = page.properties.check;

              // 公開済みのページのみ表示する場合（Notionデータベースに 'Published' チェックボックスがある場合）
              if (publishedProperty && 'checkbox' in publishedProperty && !publishedProperty.checkbox) {
                 return null; // 非公開なら表示しない
              }

              // プロパティからタイトルと説明を取得（Notionのプロパティタイプに合わせて調整）
              const title = titleProperty && 'title' in titleProperty && titleProperty.title ? getRichTextContent(titleProperty.title) : 'Untitled';
              const description = descriptionProperty && 'rich_text' in descriptionProperty && descriptionProperty.rich_text ? getRichTextContent(descriptionProperty.rich_text) : 'No description';
              
              // 日付の取得とフォーマット
              const formatDate = (dateString: string) => {
                // Notionの日付文字列(ISO 8601等)を "YYYY-MM-DD HH:MM" 形式に簡易変換
                // 時間が含まれていない場合 (YYYY-MM-DD) はそのまま返す
                // 時間が含まれている場合 (YYYY-MM-DDTHH:MM:SS...) は "T" をスペースにして、秒以降をカットする
                if (!dateString) return '';
                if (dateString.includes('T')) {
                    const [date, time] = dateString.split('T');
                    // 時間部分 (HH:MM:SS...) から HH:MM だけ抽出
                    const timeShort = time.substring(0, 5);
                    return `${date} ${timeShort}`;
                }
                return dateString;
              };

              let dateStr = '';
              if (dateProperty && 'date' in dateProperty && dateProperty.date) {
                const { start, end } = dateProperty.date;
                const startFmt = formatDate(start);
                const endFmt = end ? formatDate(end) : null;
                dateStr = endFmt ? `${startFmt} → ${endFmt}` : startFmt;
              }

              return (
                <Link key={page.id} href={`/posts/${page.id}`} className="flex flex-col h-full p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
                  {dateStr && (
                    <div className="text-sm text-gray-500 mb-2 font-medium">
                      {dateStr}
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
                  <p className="text-gray-600 line-clamp-3 text-sm">{description}</p>
                  <div className="mt-auto pt-4 text-blue-600 text-sm font-medium flex items-center">
                    <span className="ml-1">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      );
    }