import CollectionCard from "./CollectionCard";
import { type Collection } from "@/data/collections";

interface CategorySectionProps {
  title: string;
  collections: Collection[];
}

const CategorySection = ({ title, collections }: CategorySectionProps) => {
  if (collections.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              slug={collection.slug}
              title={collection.title}
              subtitle={collection.subtitle}
              previewImages={collection.previewImages}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
