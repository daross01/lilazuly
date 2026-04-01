import { useEffect, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ColorGroupSlider from "@/components/ColorGroupSlider";
import CollectionCard from "@/components/CollectionCard";
import SocialShareButtons from "@/components/SocialShareButtons";
import AdSlot from "@/components/AdSlot";
import { Button } from "@/components/ui/button";
import { getCollectionBySlug, collections } from "@/data/collections";

const CollectionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const collection = getCollectionBySlug(slug || "");

  // Scroll to hash on load
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]);

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

  const otherCollections = collections.filter((c) => c.id !== collection.id);

  const DOMAIN = "https://lilazuly.vercel.app";
  const pageTitle = `${collection.title} Wallpapers (HD & 4K) – Free Download`;
  const pageDescription = `Download free ${collection.title.toLowerCase()} wallpapers in HD and 4K resolution for iPhone, Android and desktop.`;
  const pageUrl = `${DOMAIN}/collection/${collection.slug}`;
  const pageImage = collection.previewImages[0] || "";

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
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
      </Helmet>
      <Header />
      <main className="flex-1">
        {/* Top section */}
        <section className="bg-secondary py-12 md:py-16">
          <div className="container">
            <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
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

        {/* Subcollections → SubSubcollections → Color groups */}
        <section className="py-8">
          <div className="container space-y-12">
            {collection.subcollections.map((sub) => (
              <div key={sub.id} id={sub.anchorId} className="scroll-mt-20">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">{sub.title}</h2>

                <div className="space-y-8">
                  {sub.subsubcollections.map((subsub) => (
                    <div key={subsub.id} id={subsub.anchorId} className="scroll-mt-20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base md:text-lg font-semibold text-foreground">{subsub.title}</h3>
                        <Button variant="lavender" size="sm" asChild>
                          <a href={subsub.downloadLink} target="_blank" rel="noopener noreferrer">
                            Download Full Collection
                          </a>
                        </Button>
                      </div>

                      {/* Horizontal scrollable row of 6 color groups */}
                      <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
                        {subsub.colorGroups.map((colorGroup) => (
                          <div key={colorGroup.id} className="flex-shrink-0 w-64 md:w-72 snap-start">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">{colorGroup.title}</h4>
                            <ColorGroupSlider colorGroup={colorGroup} pageUrl={pageUrl} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Other collections */}
        {otherCollections.length > 0 && (
          <section className="py-12 border-t border-border">
            <div className="container">
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-6">Explore Other Collections</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {otherCollections.slice(0, 4).map((c) => (
                  <CollectionCard key={c.id} slug={c.slug} title={c.title} subtitle={c.subtitle} previewImages={c.previewImages} />
                ))}
              </div>
            </div>
          </section>
        )}

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
