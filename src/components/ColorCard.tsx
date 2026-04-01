import { Link } from "react-router-dom";
import { useMemo } from "react";
import type { ColorConfig, Subcollection } from "@/data/collections";

interface ColorCardProps {
  color: ColorConfig;
  collectionSlug: string;
  subcollection: Subcollection | undefined;
}

const ColorCard = ({ color, collectionSlug, subcollection }: ColorCardProps) => {
  const previewImages = useMemo(() => {
    if (!subcollection || subcollection.images.length === 0) return [];
    const shuffled = [...subcollection.images].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, [subcollection]);

  if (!subcollection || previewImages.length === 0) return null;

  return (
    <Link
      to={`/collection/${collectionSlug}#${color.id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="group flex-shrink-0 w-36 sm:w-40 md:w-44 snap-start block rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="grid grid-cols-2 gap-0.5 overflow-hidden">
        {previewImages.map((img, i) => (
          <div key={img.id} className="aspect-square overflow-hidden">
            <img
              src={img.src}
              alt={`${color.name} preview ${i + 1}`}
              width={200}
              height={200}
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-foreground text-sm">{color.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{subcollection.images.length} wallpapers</p>
      </div>
    </Link>
  );
};

export default ColorCard;
