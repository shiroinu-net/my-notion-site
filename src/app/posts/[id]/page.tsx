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

export default async function PostPage({ params }: { params: { id: string } }) {
  const pageId = params.id;
  const blocks = await getPageBlocks(pageId);
  const pages = await getDatabasePages();

  const currentPage = pages.find((page) => page.id === pageId);
  const title = currentPage && 'title' in currentPage.properties.Title && currentPage.properties.Title.title
    ? getRichTextContent(currentPage.properties.Title.title)
    : 'Untitled Post';

  return (
    <div className="container mx-auto p-8">
      <Link href="/" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Home
      </Link>
      <h1 className="text-4xl font-bold mb-8">{title}</h1>
      <PostRenderer blocks={blocks} />
    </div>
  );
}
