"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

interface SmartNavigationProps {
  fullscreenMode?: boolean;
}

export default function SmartNavigation({
  fullscreenMode = false,
}: SmartNavigationProps) {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const [isOverHero, setIsOverHero] = useState(true);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    // 初始化时检查是否与 Hero 重合
    const heroHeight = window.innerHeight;
    setIsOverHero(window.scrollY < heroHeight);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 检测导航栏是否与 FullscreenHero 重合
      // FullscreenHero 是 h-screen (100vh)，从顶部开始
      // 导航栏是固定在顶部的，只要用户还能看到 FullscreenHero 的任何部分就认为有重合
      const heroHeight = window.innerHeight; // FullscreenHero 的高度 (100vh)
      setIsOverHero(currentScrollY < heroHeight);

      // 根据滚动方向决定是否显示导航栏
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 向下滚动且超过100px - 隐藏导航栏
        setShowNav(false);
      } else {
        // 向上滚动或在页面顶部 - 显示导航栏
        setShowNav(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleHomeClick = () => {
    if (pathname === "/") {
      // 如果在主页，滚动到顶部
      scrollToTop();
    } else {
      // 如果不在主页，导航到主页
      window.location.href = "/";
    }
  };

  if (!mounted) {
    return null;
  }

  // 当在全屏模式且与 Hero 重合时使用更高透明度
  const shouldUseHighTransparency = fullscreenMode && isOverHero;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        showNav ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${
        shouldUseHighTransparency
          ? "bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm"
          : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md"
      } shadow-lg`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={handleHomeClick}
            className={`text-2xl font-bold transition-colors ${
              shouldUseHighTransparency
                ? "text-white drop-shadow-lg"
                : "text-gray-900 dark:text-white"
            } hover:text-blue-600 dark:hover:text-pink-300`}
          >
            Ed&apos;s cave
          </button>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex space-x-8">
              <button
                onClick={handleHomeClick}
                className={`transition-colors ${
                  shouldUseHighTransparency
                    ? "text-white hover:text-pink-300 drop-shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-pink-300"
                }`}
              >
                Home
              </button>
              <Link
                href="/cv"
                className={`transition-colors ${
                  shouldUseHighTransparency
                    ? "text-white hover:text-pink-300 drop-shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-pink-300"
                }`}
              >
                CV
              </Link>
              <Link
                href="/blog"
                className={`transition-colors ${
                  shouldUseHighTransparency
                    ? "text-white hover:text-pink-300 drop-shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-pink-300"
                }`}
              >
                Blog
              </Link>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                const newTheme = theme === "dark" ? "light" : "dark";
                console.log(`Switching from ${theme} to ${newTheme}`);
                setTheme(newTheme);
                // Debug: Check HTML class after a short delay
                setTimeout(() => {
                  console.log(
                    "HTML classes after theme change:",
                    document.documentElement.className
                  );
                }, 100);
              }}
              className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                shouldUseHighTransparency
                  ? "bg-white/20 hover:bg-white/30 drop-shadow-md"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
              aria-label={`Switch to ${
                theme === "dark" ? "light" : "dark"
              } mode`}
            >
              <div className="relative w-5 h-5">
                <svg
                  className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                    theme === "dark"
                      ? "opacity-0 rotate-90 scale-0"
                      : "opacity-100 rotate-0 scale-100"
                  } ${
                    shouldUseHighTransparency
                      ? "text-white drop-shadow-md"
                      : "text-yellow-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>

                <svg
                  className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                    theme === "dark"
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-0"
                  } ${
                    shouldUseHighTransparency
                      ? "text-white drop-shadow-md"
                      : "text-blue-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </div>
            </button>

            <button
              className={`md:hidden p-2 rounded-lg ${
                shouldUseHighTransparency
                  ? "text-white drop-shadow-md"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
