import { getPageBlocks, getDatabasePages, getRichTextContent } from '../../../../lib/notion';
import Link from 'next/link';
import PostRenderer from './post-renderer';

export const revalidate = 60;

export async function generateStaticParams() {
  const pages = await getDatabasePages();
  return pages.map((page) => ({
    id: page.id,
  }));
}


// ヘルパー: プロパティからテキストを安全に取得
const getTextFromProp = (page: any, propName: string, type: 'rich_text' | 'title' | 'select' | 'status' = 'rich_text') => {
  const prop = page.properties[propName];
  if (!prop) return '';
  
  if (type === 'rich_text' || type === 'title') {
    return getRichTextContent(prop[type] || []);
  }
  if (type === 'select') {
    return prop.select?.name || '';
  }
  if (type === 'status') {
    return prop.status?.name || '';
  }
  return '';
};

// 汎用プロパティレンダラー
const renderPropertyValue = (property: any) => {
  switch (property.type) {
    case 'title':
    case 'rich_text':
      return getRichTextContent(property[property.type]);
    case 'url':
      return property.url ? (
        <a 
          href={property.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:text-blue-800 underline break-all"
        >
          {property.url}
        </a>
      ) : (
        '-'
      );
    case 'date':
      if (!property.date) return '-';
      const { start, end } = property.date;
      return end ? `${start} → ${end}` : start;
    case 'checkbox':
      return (
        <label className="inline-flex items-center">
          <input 
            type="checkbox" 
            checked={property.checkbox} 
            disabled 
            className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300" 
          />
          <span className="ml-2 text-sm text-gray-700">{property.checkbox ? 'True' : 'False'}</span>
        </label>
      );
    case 'email':
      return property.email ? (
        <a href={`mailto:${property.email}`} className="text-blue-600 hover:text-blue-800 underline">
          {property.email}
        </a>
      ) : '-';
    case 'phone_number':
      return property.phone_number ? (
        <a href={`tel:${property.phone_number}`} className="text-blue-600 hover:text-blue-800 underline">
          {property.phone_number}
        </a>
      ) : '-';
    case 'select':
      return property.select ? (
        <span className="inline-block px-2 py-1 rounded text-sm bg-gray-100 text-gray-800 border">
          {property.select.name}
        </span>
      ) : '-';
    case 'status':
       return property.status ? (
        <span className="inline-block px-2 py-1 rounded text-sm bg-gray-100 text-gray-800 border">
          {property.status.name}
        </span>
      ) : '-';
    case 'multi_select':
      return property.multi_select.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {property.multi_select.map((opt: any) => (
            <span key={opt.id} className="inline-block px-2 py-1 rounded text-sm bg-gray-100 text-gray-800 border">
              {opt.name}
            </span>
          ))}
        </div>
      ) : '-';
    case 'formula':
      if (property.formula.type === 'string') {
        const val = property.formula.string;
        if (val?.startsWith('http')) {
          return (
            <a 
              href={val} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 underline break-all"
            >
              {val}
            </a>
          );
        }
        return val || '-';
      }
      if (property.formula.type === 'number') return property.formula.number ?? '-';
      if (property.formula.type === 'boolean') return property.formula.boolean ? 'True' : 'False';
      if (property.formula.type === 'date') return property.formula.date?.start || '-';
      return JSON.stringify(property.formula);
    case 'number':
      return property.number ?? '-';
    default:
      return <span className="text-gray-400 font-mono text-xs">{property.type}</span>;
  }
};

export default async function PostPage({ params }: { params: { id: string } }) {
  const pageId = params.id;
  const blocks = await getPageBlocks(pageId);
  const pages = await getDatabasePages();

  const currentPage = pages.find((page) => page.id === pageId);

  if (!currentPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Post not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // --- プロパティ取得とフォーマット (Header用) ---
  const title = getTextFromProp(currentPage, 'Title', 'title') || 'Untitled Post';

  // Status
  let statusRaw = getTextFromProp(currentPage, 'Status', 'select') || getTextFromProp(currentPage, 'Status', 'status');
  let statusLabel = statusRaw;
  if (statusRaw === '2..comming') statusLabel = 'comming';
  if (statusRaw === '3..archive') statusLabel = 'archive';

  let statusClass = 'bg-gray-100 text-gray-800 border-gray-200';
  if (statusLabel === 'comming') statusClass = 'bg-blue-100 text-blue-800 border-blue-200';
  if (statusLabel === 'archive') statusClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';

  // Place & Address
  const placeText = getTextFromProp(currentPage, 'Place', 'rich_text');
  const addressText = getTextFromProp(currentPage, 'Address', 'rich_text');
  const mapQuery = addressText || placeText;
  const mapUrl = mapQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : null;

  // Headerで個別表示したため表示除外するキー
  // ※ Status, Place, Address, Title はヘッダーでリッチに表示済み
  const handledKeys = ['Title', 'Status', 'Place', 'Address', 'check']; 

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      {/* ナビゲーション */}
      <nav className="border-b py-4 mb-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center transition-colors">
            <span className="mr-1">←</span> Back to Home
          </Link>
        </div>
      </nav>

      <article className="container mx-auto px-4 max-w-3xl">
        {/* ヘッダーエリア */}
        <header className="mb-10">
          {/* Status Badge */}
          {statusLabel && (
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border mb-4 ${statusClass}`}>
              {statusLabel}
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 leading-tight">
            {title}
          </h1>

          {/* Meta Info (Place & Address) */}
          {(placeText || addressText) && (
            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 mt-4 space-y-1 sm:space-y-0 sm:space-x-4">
              {placeText && (
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  {mapUrl ? (
                    <a 
                      href={mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-medium text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                    >
                      {placeText}
                    </a>
                  ) : (
                    <span className="font-medium">{placeText}</span>
                  )}
                </div>
              )}
              
              {addressText && (
                <div className="flex items-center text-gray-500">
                  <span className="hidden sm:inline mx-2 text-gray-300">|</span>
                  <span>{addressText}</span>
                </div>
              )}
            </div>
          )}
        </header>

        {/* その他のプロパティ情報 */}
        <div className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Details</h3>
          <div className="space-y-3">
            {Object.entries(currentPage.properties)
              .filter(([key]) => !handledKeys.includes(key)) // すでに表示したキーを除外
              .map(([key, value]) => (
                <div key={key} className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                  <div className="font-medium text-gray-500">{key}</div>
                  <div className="col-span-2 text-gray-800 break-words font-mono sm:font-sans">
                    {renderPropertyValue(value)}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl">
          <PostRenderer blocks={blocks} />
        </div>
      </article>
    </div>
  );
}
