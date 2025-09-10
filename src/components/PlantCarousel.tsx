"use client";
import { useEffect, useRef, useState } from "react";

type Img = { id: string; url: string };

export function PlantCarousel({ images, name }: { images: Img[]; name: string }) {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  useEffect(() => { setIndex(0); }, [images?.[0]?.id]);

  if (!images || images.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-[rgba(45,80,22,0.15)]">
        <div className="aspect-[4/3] bg-[rgba(45,80,22,0.08)] flex items-center justify-center text-xs opacity-60">Photo coming soon</div>
      </div>
    );
  }

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) {
      if (dx > 0) prev(); else next();
    }
    startX.current = null;
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-[rgba(45,80,22,0.15)]" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="aspect-[4/3] bg-[rgba(45,80,22,0.08)]">
        <img src={images[index].url} alt={name} className="h-full w-full object-cover select-none" draggable={false} />
      </div>
      {/* Edge arrows - transparent until hover */}
      {images.length > 1 && (
        <>
          <button aria-label="Previous" onClick={prev} className="hidden sm:block absolute left-0 top-0 h-full w-1/5 text-white/80 hover:text-white transition flex items-center justify-start">
            <span className="ml-2 bg-black/30 hover:bg-black/50 rounded-full px-3 py-2">‹</span>
          </button>
          <button aria-label="Next" onClick={next} className="hidden sm:block absolute right-0 top-0 h-full w-1/5 text-white/80 hover:text-white transition flex items-center justify-end">
            <span className="mr-2 bg-black/30 hover:bg-black/50 rounded-full px-3 py-2">›</span>
          </button>
        </>
      )}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {images.map((_, i) => (
            <span key={i} onClick={() => setIndex(i)} className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`} />
          ))}
        </div>
      )}
    </div>
  );
}


