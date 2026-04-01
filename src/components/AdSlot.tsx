interface AdSlotProps {
  location: "collection-top" | "collection-middle" | "collection-bottom" | "homepage" | "category-bottom";
}

const AdSlot = ({ location }: AdSlotProps) => {
  return (
    <div
      className="ad-slot w-full"
      data-ad-location={location}
      aria-hidden="true"
    />
  );
};

export default AdSlot;
