import { Link } from "react-router-dom";
import { useMemo } from "react";

interface CollectionCardProps {
  slug: string;
  title: string;
  subtitle: string;
  previewImages: string[];
}

const shuffleArray = (array: string[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const CollectionCard = ({ slug, title, subtitle, previewImages }: CollectionCardProps) => {
  const selectedImages = useMemo(() => shuffleArray(previewImages).slice(0, 4), [previewImages]);

  return (
    <Link
      to={`/collection/${slug}`}
      onClick={() => window.scrollTo(0, 0)}
      className="group block rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* 4-image collage */}
      <div className="grid grid-cols-2 gap-0.5 overflow-hidden">
        {selectedImages.map((img, i) => (
          <div key={i} className="aspect-square overflow-hidden">
            <img
              src={img}
              alt={`${title} preview ${i + 1}`}
              width={200}
              height={200}
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </Link>
  );
};

export default CollectionCard;
