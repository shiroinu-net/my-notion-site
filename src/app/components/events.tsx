// src/app/page.tsx
    import Link from 'next/link';
    import { getDatabasePages, getRichTextContent } from '../../../lib/notion'; // lib/notion.tsからインポート

    export const revalidate = 60; // 60秒ごとにISRでデータを再取得 (ビルドは静的だが、データは更新可能)

    export default async function Events() {
      const pages = await getDatabasePages(); // Notionデータベースのページを取得

      return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <h2 className="text-4xl font-bold mb-8">Events</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pages.map((page) => {
              // Notionデータベースのプロパティ名に合わせて調整してください
              const titleProperty = page.properties.Title;
              const descriptionProperty = page.properties.Place;
              const publishedProperty = page.properties.check;

              // 公開済みのページのみ表示する場合（Notionデータベースに 'Published' チェックボックスがある場合）
              if (publishedProperty && 'checkbox' in publishedProperty && !publishedProperty.checkbox) {
                 return null; // 非公開なら表示しない
              }

              // プロパティからタイトルと説明を取得（Notionのプロパティタイプに合わせて調整）
              const title = titleProperty && 'title' in titleProperty && titleProperty.title ? getRichTextContent(titleProperty.title) : 'Untitled';
              const description = descriptionProperty && 'rich_text' in descriptionProperty && descriptionProperty.rich_text ? getRichTextContent(descriptionProperty.rich_text) : 'No description';

              return (
                <Link key={page.id} href={`/posts/${page.id}`} className="block p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-2xl font-semibold mb-2">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                  {/* その他のプロパティを表示することも可能 */}
                </Link>
              );
            })}
          </div>
        </main>
      );
    }