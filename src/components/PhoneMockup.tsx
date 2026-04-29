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
      {/* Screenshot — inset matches the frame bezel thickness */}
      <div className="absolute inset-x-[2.5%] inset-y-[1.5%] overflow-hidden rounded-[10%/6%]">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          {...imgProps}
          className={`w-full h-full object-cover ${imgProps?.className ?? ""}`}
        />
      </div>

      {/* iPhone frame overlay — stretched to fill the 9:16 container */}
      <img
        src={iphoneFrame}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
      />

      {topRightSlot && (
        <div className="absolute top-2 right-2 z-10">{topRightSlot}</div>
      )}
    </div>
  );
};

export default PhoneMockup;
