import { promises as fs } from 'fs';
import path from 'path';

export default async function Profile() {
  const profileHtmlPath = path.join(process.cwd(), 'src', 'app', 'profile.html');
  const profileHtml = await fs.readFile(profileHtmlPath, 'utf-8');

  return (
    <section id="profile" className="py-20">
      <h2 className="text-3xl font-bold text-center mb-8">Profile</h2>
      <div dangerouslySetInnerHTML={{ __html: profileHtml }} />
    </section>
  );
}
