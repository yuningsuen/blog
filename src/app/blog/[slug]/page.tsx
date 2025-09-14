import SmartNavigation from "../../components/SmartNavigation";
import Footer from "../../components/Footer";
import Link from "next/link";
import TableOfContents from "../../components/TableOfContents";
import {
  getPostBySlug,
  getAllPosts,
  formatDate,
  BlogPost,
} from "../../../lib/blog";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 生成静态路由
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 生成页面元数据
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "post not found",
    };
  }

  return {
    title: `${post.title}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

// 相关文章推荐组件
async function RelatedPosts({ currentPost }: { currentPost: BlogPost }) {
  const allPosts = await getAllPosts();

  // 基于标签匹配推荐相关文章
  const relatedPosts = allPosts
    .filter(
      (post) =>
        post.slug !== currentPost.slug &&
        post.tags.some((tag) => currentPost.tags.includes(tag))
    )
    .slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Related posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`}>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {formatDate(post.date)}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <SmartNavigation />
      <main className="pt-20">
        {/* 面包屑导航 */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <nav className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            <Link
              href="/"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/blog"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white">{post.title}</span>
          </nav>
        </div>

        {/* 文章头部 */}
        <header className="max-w-4xl mx-auto px-6 pb-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-center space-x-6 text-gray-600 dark:text-gray-400 mb-8">
              <time dateTime={post.date} className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(post.date)}
              </time>

              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {Math.ceil((post.content?.length || 0) / 500)} mins read
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </header>

        {/* 文章内容 */}
        <article className="max-w-4xl mx-auto px-6">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* 侧边栏目录 */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <TableOfContents contentHtml={post.contentHtml || ""} />
              </div>
            </aside>

            {/* 主要内容 */}
            <div className="lg:col-span-3">
              {/* 移动端目录 */}
              <div className="lg:hidden mb-8">
                <TableOfContents contentHtml={post.contentHtml || ""} />
              </div>

              {/* 文章正文 */}
              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }}
              />

              {/* 文章底部操作 */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <Link
                    href="/blog"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back to blog list
                  </Link>
                </div>
              </div>

              {/* 相关文章 */}
              <RelatedPosts currentPost={post} />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
