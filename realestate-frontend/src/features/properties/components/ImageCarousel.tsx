import { useState } from "react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  emptyStateButton?: {
    label: string;
    onClick: () => void;
  };
}

export function ImageCarousel({ images, alt, emptyStateButton }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    if (emptyStateButton) {
      return (
        <button
          onClick={emptyStateButton.onClick}
          className="flex h-96 w-full flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-line bg-line/40 text-mute transition-colors hover:border-slate hover:text-slate"
        >
          <span className="text-3xl">+</span>
          <span className="text-sm font-medium">{emptyStateButton.label}</span>
        </button>
      );
    }
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-card bg-line text-mute">
        No photos yet
      </div>
    );
  }

  const goPrev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-96 w-full overflow-hidden rounded-card bg-line">
        <img src={images[index]} alt={alt} className="h-full w-full object-cover" />

        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/60 px-3 py-2 text-white hover:bg-ink/80"
            >
              ‹
            </button>
            <button
              onClick={goNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/60 px-3 py-2 text-white hover:bg-ink/80"
            >
              ›
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/60 px-2.5 py-1 text-xs text-white">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setIndex(i)}
              className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                i === index ? "border-slate" : "border-transparent"
              }`}
            >
              <img src={img} alt={`${alt} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}