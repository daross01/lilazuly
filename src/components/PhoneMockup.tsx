import iphoneFrame from "@/assets/iphone-frame.png";

interface PhoneMockupProps {
  src: string;
  alt: string;
  className?: string;
  /** Extra attributes applied to the wallpaper background div (e.g. data-pin-*) */
  imgProps?: React.HTMLAttributes<HTMLDivElement> & Record<`data-${string}`, string | number | boolean>;
  /** Slot rendered on top-right of the mockup (e.g. share button) */
  topRightSlot?: React.ReactNode;
}

/**
 * Renders a wallpaper inside a transparent iPhone frame overlay.
 * The wallpaper is rendered as a CSS background-image (not <img>) to
 * dificultar long-press "Save Image" on iOS Safari and Chrome Android.
 */
const PhoneMockup = ({ src, alt, className = "", imgProps, topRightSlot }: PhoneMockupProps) => {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{ aspectRatio: "573 / 1167" }}
    >
      {/* Screenshot area — positioned exactly inside the frame's screen */}
      <div
        className="absolute overflow-hidden rounded-[12%/5.5%]"
        style={{
          left: "5.93%",
          right: "5.76%",
          top: "8.14%",
          bottom: "2.83%",
        }}
      >
        {/* Wallpaper as background-image (long-press protection) */}
        <div
          role="img"
          aria-label={alt}
          {...imgProps}
          className={`wallpaper-protected w-full h-full bg-cover bg-center pointer-events-none select-none ${imgProps?.className ?? ""}`}
          style={{
            backgroundImage: `url(${src})`,
            WebkitTouchCallout: "none",
            ...(imgProps?.style ?? {}),
          }}
        />

        {/* Transparent overlay to swallow long-press over the wallpaper area */}
        <div className="absolute inset-0 z-10 wallpaper-protected" />
      </div>

      {/* iPhone frame overlay */}
      <img
        src={iphoneFrame}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-20"
      />

      {topRightSlot && (
        <div className="absolute top-2 right-2 z-30">{topRightSlot}</div>
      )}
    </div>
  );
};

export default PhoneMockup;
