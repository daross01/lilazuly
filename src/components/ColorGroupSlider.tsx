import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ColorGroup } from "@/data/collections";

const DOMAIN = "https://lilazuly.vercel.app";
const BATCH_SIZE = 10;

interface ColorGroupSliderProps {
  colorGroup: ColorGroup;
  pageUrl?: string;
}

const ColorGroupSlider = ({ colorGroup, pageUrl = "" }: ColorGroupSliderProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(BATCH_SIZE);

  const visibleImages = colorGroup.images.slice(0, visible);
  const hasMore = visible < colorGroup.images.length;

  const loadMore = useCallback(() => {
    setVisible((v) => Math.min(v + BATCH_SIZE, colorGroup.images.length));
  }, [colorGroup.images.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { root: scrollRef.current, rootMargin: "0px 200px 0px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const getPinUrl = (imageSrc: string, description: string) => {
    const media = encodeURIComponent(imageSrc.startsWith("http") ? imageSrc : `${DOMAIN}${imageSrc}`);
    const url = encodeURIComponent(pageUrl || DOMAIN);
    const desc = encodeURIComponent(description);
    return `https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${desc}`;
  };

  return (
    <div id={colorGroup.anchorId} className="scroll-mt-20">
      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full p-1.5 shadow-card opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} className="text-foreground" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
        >
          {visibleImages.map((image) => {
            const pinDescription = `${image.alt} - Free HD wallpaper`;
            return (
              <div
                key={image.id}
                className="relative flex-shrink-0 w-40 md:w-52 rounded-xl overflow-hidden shadow-card snap-start group/card"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  width={208}
                  height={370}
                  decoding="async"
                  className="w-full aspect-[9/16] object-cover"
                  loading="lazy"
                  data-pin-description={pinDescription}
                  data-pin-media={image.src.startsWith("http") ? image.src : `${DOMAIN}${image.src}`}
                />
                <a
                  href={getPinUrl(image.src, pinDescription)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity shadow-card"
                  aria-label="Pin to Pinterest"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-foreground fill-current"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                </a>
              </div>
            );
          })}

          {hasMore && (
            <div ref={sentinelRef} className="flex-shrink-0 w-10 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Loading...</span>
            </div>
          )}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full p-1.5 shadow-card opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} className="text-foreground" />
        </button>
      </div>
    </div>
  );
};

export default ColorGroupSlider;
