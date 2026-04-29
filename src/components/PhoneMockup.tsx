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
 * Insets and aspect ratio are calibrated to the actual frame asset
 * (573x1167, inner screen at L5.93% R5.76% T8.14% B2.83%).
 */
const PhoneMockup = ({ src, alt, className = "", imgProps, topRightSlot }: PhoneMockupProps) => {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{ aspectRatio: "573 / 1167" }}
    >
      {/* Screenshot — positioned exactly inside the frame's screen area */}
      <div
        className="absolute overflow-hidden rounded-[12%/5.5%]"
        style={{
          left: "5.93%",
          right: "5.76%",
          top: "8.14%",
          bottom: "2.83%",
        }}
      >
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
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
      />

      {topRightSlot && (
        <div className="absolute top-2 right-2 z-10">{topRightSlot}</div>
      )}
    </div>
  );
};

export default PhoneMockup;
