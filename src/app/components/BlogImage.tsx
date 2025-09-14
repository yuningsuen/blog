import Image from "next/image";

interface BlogImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function BlogImage({
  src,
  alt,
  caption,
  width = 800,
  height = 600,
  priority = false,
}: BlogImageProps) {
  const imageSrc = src.startsWith("/") ? src : `/${src}`;

  return (
    <figure className="my-8 text-center">
      <div className="relative inline-block max-w-full">
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
