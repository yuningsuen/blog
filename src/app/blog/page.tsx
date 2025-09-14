import SmartNavigation from "../components/SmartNavigation";
import Footer from "../components/Footer";
import Link from "next/link";
import { getAllPosts, getAllTags, formatDate, BlogPost } from "../../lib/blog";

export const metadata = {
  title: "Blog",
  description: "What's on my mind?",
};

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-pink-300 transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="text-blue-600 dark:text-pink-300 hover:text-blue-700 dark:hover:text-pink-200 font-medium text-sm"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}

function TagFilter({
  tags,
  selectedTag,
}: {
  tags: string[];
  selectedTag?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link
        href="/blog"
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          !selectedTag
            ? "bg-blue-600 dark:bg-pink-500 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        All
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog?tag=${encodeURIComponent(tag)}`}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedTag === tag
              ? "bg-blue-600 dark:bg-pink-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const [allPosts, allTags, resolvedSearchParams] = await Promise.all([
    getAllPosts(),
    getAllTags(),
    searchParams,
  ]);

  const selectedTag = resolvedSearchParams.tag;
  const filteredPosts = selectedTag
    ? allPosts.filter((post) =>
        post.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())
      )
    : allPosts;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <SmartNavigation />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              What&apos;s on my mind?
            </h1>
          </div>

          <TagFilter tags={allTags} selectedTag={selectedTag} />

          <section>
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                  📝
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedTag
                    ? `no posts with tag "${selectedTag}" found`
                    : "no posts yet"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedTag
                    ? "try another tag"
                    : "stay tuned for more content"}
                </p>
                {selectedTag && (
                  <Link
                    href="/blog"
                    className="inline-block mt-4 px-4 py-2 bg-blue-600 dark:bg-pink-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-600 transition-colors"
                  >
                    View all posts
                  </Link>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
