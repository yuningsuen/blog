interface BlogVideoProps {
  src: string;
  caption?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  width?: string;
  height?: string;
}

export default function BlogVideo({
  src,
  caption,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = true,
  width = "100%",
  height = "auto",
}: BlogVideoProps) {
  const videoSrc = src.startsWith("/") ? src : `/${src}`;

  return (
    <figure className="my-8 text-center">
      <div className="relative inline-block max-w-full">
        <video
          src={videoSrc}
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          style={{ width, height }}
          className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 max-w-full"
        ></video>
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
