import Navbar from '../../components/Navbar';
import PageTransition from '../../components/PageTransition';
import { siteConfig } from '../../siteConfig';
import PublishClient from './PublishClient';

export const metadata = {
  title: "发布内容 | " + siteConfig.title,
  description: "发布新的文章、说说或杂谈",
};

export default function PublishPage() {
  return (
    <div className="min-h-screen relative pb-10">
      <Navbar />
      <PageTransition>
        <PublishClient />
      </PageTransition>
    </div>
  );
}
