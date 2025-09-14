"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

export default function FullscreenHero() {
  const [scrollY, setScrollY] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const texts = useMemo(() => ["Hello, I'm Ed :)", "你好，我是Ed ：）"], []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 打字机效果
  useEffect(() => {
    const timeout = setTimeout(
      () => {
        const currentTextToType = texts[textIndex];

        if (!isDeleting) {
          // 正在打字
          if (currentIndex < currentTextToType.length) {
            setCurrentText(currentTextToType.slice(0, currentIndex + 1));
            setCurrentIndex(currentIndex + 1);
          } else {
            // 打字完成，等待一段时间后开始删除
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          // 正在删除
          if (currentIndex > 0) {
            setCurrentText(currentTextToType.slice(0, currentIndex - 1));
            setCurrentIndex(currentIndex - 1);
          } else {
            // 删除完成，切换到下一个文本
            setIsDeleting(false);
            setTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? 50 : 100
    ); // 删除速度比打字速度快

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, textIndex, texts]);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <Image
          src="/images/DSC02196.jpg"
          alt="Hero background"
          fill
          className="object-cover"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`, // 视差效果
          }}
          priority
        />
        {/* 深色遮罩 */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight min-h-[1.2em]">
            <span className="text-blue-400 dark:text-pink-300">
              {currentText}
            </span>
            <span className="animate-pulse">|</span>
          </h1>
        </div>

        {/* 向下滚动指示器 */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce"
          onClick={scrollToContent}
        >
          <div className="flex flex-col items-center space-y-2">
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
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
