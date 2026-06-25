export default function imageLoader({ src }) {
  const basePath = process.env.NODE_ENV === 'production' ? '/my-notion-site' : '';
  return `${basePath}${src}`;
}
