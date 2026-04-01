import { useMemo } from "react";
import type { ColorGroup } from "@/data/collections";

interface ColorGroupCardProps {
  colorGroup: ColorGroup;
  onClick?: () => void;
}

const shuffleArray = (array: string[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const ColorGroupCard = ({ colorGroup, onClick }: ColorGroupCardProps) => {
  const previewImages = useMemo(
    () => shuffleArray(colorGroup.images.map((img) => img.src)).slice(0, 4),
    [colorGroup.images]
  );

  return (
    <div
      onClick={onClick}
      className="group block rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300 text-left w-full cursor-pointer"
    >
      {/* 2x2 image collage */}
      <div className="grid grid-cols-2 gap-0.5 overflow-hidden">
        {previewImages.map((img, i) => (
          <div key={i} className="aspect-square overflow-hidden">
            <img
              src={img}
              alt={`${colorGroup.title} preview ${i + 1}`}
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
        <h4 className="font-semibold text-foreground text-sm">{colorGroup.title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          {colorGroup.images.length} wallpapers
        </p>
      </div>
    </div>
  );
};

export default ColorGroupCard;
