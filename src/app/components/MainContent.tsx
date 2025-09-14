import Link from "next/link";
import Image from "next/image";

export default function MainContent() {
  return (
    <section id="content" className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Who?
              </h2>
            </div>

            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Ed is a student software developer who loves Linux and birds
                (yes 🐧 are birds as well). Besides coding, he also enjoys
                snowboarding and bouldering. Btw did I mention he loves birds?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/works"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-blue-600 dark:bg-pink-600 hover:bg-blue-700 dark:hover:bg-pink-700 rounded-lg transition-colors"
              >
                Check out his CV
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-pink-400 rounded-lg transition-colors"
              >
                How about some blogs?
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src="/images/blog/snow-angel.jpg"
                  alt="snowangel"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src="/images/blog/grouse-mountain-view-2.jpg"
                  alt="Grouse Mountain View"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src="/images/blog/steller-s-jay-at-revelstoke.jpg"
                  alt="Steller's Jay at Revelstoke"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="relative h-32 rounded-lg overflow-hidden">
                <Image
                  src="/images/blog/grouse-mountain-view-3.jpg"
                  alt="Grouse Mountain night view"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Highlights
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/blog/snowboard-safari" className="group">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src="/images/blog/grouse-mountain-view-1.jpg"
                    alt="snowboard safari"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Snowboard safari
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    🏂 in Greater Vancouver...
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/blog/settling-down-in-metro-vancouver"
              className="group"
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src="/images/blog/route.jpg"
                    alt="travel route"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    New in town
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    How I settled down in Metro Vancouver...
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
