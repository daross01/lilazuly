import iphoneFrame from "@/assets/iphone-frame.png";

interface PhoneMockupProps {
  src: string;
  alt: string;
  className?: string;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  /** Slot rendered on top-right of the mockup (e.g. share button) */
  topRightSlot?: React.ReactNode;
}

/**
 * Renders a screenshot inside a transparent iPhone frame overlay.
 * The frame uses pointer-events-none so it never blocks interactions.
 */
const PhoneMockup = ({ src, alt, className = "", imgProps, topRightSlot }: PhoneMockupProps) => {
  return (
    <div className={`relative aspect-[9/16] ${className}`}>
      {/* Screenshot */}
      <div className="absolute inset-[3.5%] overflow-hidden rounded-[8%]">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          {...imgProps}
          className={`w-full h-full object-cover ${imgProps?.className ?? ""}`}
        />
      </div>

      {/* iPhone frame overlay */}
      <img
        src={iphoneFrame}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
      />

      {topRightSlot && (
        <div className="absolute top-2 right-2 z-10">{topRightSlot}</div>
      )}
    </div>
  );
};

export default PhoneMockup;
