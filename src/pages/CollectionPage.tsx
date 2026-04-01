import { useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubcollectionSlider from "@/components/SubcollectionSlider";
import CollectionCard from "@/components/CollectionCard";
import SocialShareButtons from "@/components/SocialShareButtons";
import AdSlot from "@/components/AdSlot";
import {
  getCollectionBySlug,
  getCategoryById,
  getCollectionsByCategory,
  categories,
  collections,
} from "@/data/collections";

const CollectionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const collection = getCollectionBySlug(slug || "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Scroll to hash on load
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]);

  // Update URL hash on scroll
  useEffect(() => {
    if (!collection) return;

    const ids = collection.subcollections.map((s) => s.anchorId);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target?.id) {
          const newHash = `#${visible.target.id}`;
          if (window.location.hash !== newHash) {
            window.history.replaceState(null, "", newHash);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    elements.forEach((el) => observerRef.current!.observe(el));
    return () => observerRef.current?.disconnect();
  }, [collection]);

  if (!collection) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Collection not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const category = getCategoryById(collection.categoryId);
  const relatedCollections = getCollectionsByCategory(collection.categoryId).filter(
    (c) => c.id !== collection.id
  );
  const otherCategories = categories.filter((c) => c.id !== collection.categoryId);

  const DOMAIN = "https://lilazuly.vercel.app";
  const pageTitle = `${collection.title} Wallpapers (HD & 4K) – Free Download`;
  const pageDescription = `Download free ${collection.title.toLowerCase()} wallpapers in HD and 4K resolution for iPhone, Android and desktop.`;
  const pageUrl = `${DOMAIN}/collection/${collection.slug}`;
  const pageImage = collection.previewImages[0] || "";
  const pageKeywords = collection.subcollections
    .map((s) => s.title.toLowerCase())
    .concat([collection.title.toLowerCase(), "wallpapers", "aesthetic", "free download", "iPhone", "Android"])
    .join(", ");

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": pageTitle,
            "description": pageDescription,
            "url": pageUrl,
            "image": collection.subcollections.flatMap((sub) =>
              sub.images.slice(0, 5).map((img) => ({
                "@type": "ImageObject",
                "name": `${sub.title} ${collection.title} Wallpaper`,
                "description": `Aesthetic ${sub.title.toLowerCase()} ${collection.title.toLowerCase()} wallpaper in HD resolution`,
                "contentUrl": img.src.startsWith("http") ? img.src : `${DOMAIN}${img.src}`,
              }))
            ),
          })}
        </script>
      </Helmet>
      <Header />
      <main className="flex-1">
        {/* Top section */}
        <section className="bg-secondary py-12 md:py-16">
          <div className="container">
            {/* Breadcrumb */}
            <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              {category && (
                <>
                  <span>{category.title}</span>
                  <span>/</span>
                </>
              )}
              <span className="text-foreground">{collection.title}</span>
            </nav>

            <h1 className="text-2xl md:text-4xl font-bold text-foreground">{collection.title}</h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl">
              {collection.description}
            </p>
            <div className="mt-4">
              <SocialShareButtons
                url={pageUrl}
                title={pageTitle}
                description={pageDescription}
                image={pageImage}
              />
            </div>
          </div>
        </section>

        {/* Ad slot: collection top */}
        <div className="container py-4">
          <AdSlot location="collection-top" />
        </div>

        {/* Subcollections */}
        <section className="py-8">
          <div className="container">
            {collection.subcollections.map((sub, index) => (
              <div key={sub.id}>
                <SubcollectionSlider
                  subcollection={sub}
                  collectionTitle={collection.title}
                  pageUrl={pageUrl}
                />
                {/* Ad slot: between subcollections (after every 2nd) */}
                {index > 0 && index % 2 === 1 && index < collection.subcollections.length - 1 && (
                  <div className="py-4">
                    <AdSlot location="collection-middle" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Related Wallpapers */}
        {relatedCollections.length > 0 && (
          <section className="py-12 border-t border-border">
            <div className="container">
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-6">Related Wallpapers</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedCollections.slice(0, 4).map((c) => (
                  <CollectionCard key={c.id} slug={c.slug} title={c.title} subtitle={c.subtitle} previewImages={c.previewImages} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Other categories */}
        <section className="py-12 border-t border-border">
          <div className="container">
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-6">Explore Other Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {otherCategories.map((cat) => {
                const catCollections = getCollectionsByCategory(cat.id);
                if (catCollections.length === 0) return null;
                const first = catCollections[0];
                return (
                  <CollectionCard
                    key={cat.id}
                    slug={first.slug}
                    title={cat.title}
                    subtitle={`${catCollections.length} collection${catCollections.length > 1 ? "s" : ""}`}
                    previewImages={first.previewImages}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Ad slot: collection bottom */}
        <div className="container py-4">
          <AdSlot location="collection-bottom" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionPage;
