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

const renderPropertyValue = (property: any) => {
  switch (property.type) {
    case 'title':
    case 'rich_text':
      // シンプルなテキスト表示。必要なら装飾付きRichTextコンポーネントを使用
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
            className="form-checkbox h-4 w-4 text-blue-600" 
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
        <span className="inline-block px-2 py-1 rounded text-sm bg-gray-200 text-gray-800">
          {property.select.name}
        </span>
      ) : '-';
    case 'multi_select':
      return property.multi_select.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {property.multi_select.map((opt: any) => (
            <span key={opt.id} className="inline-block px-2 py-1 rounded text-sm bg-gray-200 text-gray-800">
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
      return <span className="text-gray-400 font-mono text-xs">{property.type} (Not implemented)</span>;
  }
};

export default async function PostPage({ params }: { params: { id: string } }) {
  const pageId = params.id;
  const blocks = await getPageBlocks(pageId);
  const pages = await getDatabasePages();

  const currentPage = pages.find((page) => page.id === pageId);

  if (!currentPage) {
    return <div className="container mx-auto p-8">Post not found</div>;
  }

  const title = 'title' in currentPage.properties.Title && currentPage.properties.Title.title
    ? getRichTextContent(currentPage.properties.Title.title)
    : 'Untitled Post';

  return (
    <div className="container mx-auto p-8">
      <Link href="/" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Home
      </Link>
      
      <article className="prose lg:prose-xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{title}</h1>

        {/* Properties Section */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
          <h2 className="text-xl font-bold mb-4">Properties</h2>
          <div className="grid grid-cols-1 gap-4 text-sm">
            {Object.entries(currentPage.properties)
              .filter(([key]) => key !== 'check')
              .map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-4 border-b pb-2 last:border-0 items-center">
                  <div className="font-semibold text-gray-600">{key}</div>
                  <div className="col-span-2 text-gray-800 break-words">
                    {renderPropertyValue(value)}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Body Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Body Content</h2>
          <PostRenderer blocks={blocks} />
        </div>
      </article>
    </div>
  );
}
