import { useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ColorGroupSlider from "@/components/ColorGroupSlider";
import SocialShareButtons from "@/components/SocialShareButtons";
import AdSlot from "@/components/AdSlot";
import { Button } from "@/components/ui/button";
import CollectionCard from "@/components/CollectionCard";
import { collections, getSubSubcollectionBySlug, type SubSubcollection, type Subcollection } from "@/data/collections";

const DOMAIN = "https://lilazuly.vercel.app";

const SubSubcollectionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const subsub = getSubSubcollectionBySlug(slug || "");

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]);

  if (!subsub) {
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

  const totalImages = subsub.colorGroups.reduce((sum, cg) => sum + cg.images.length, 0);

  // Find parent subcollection + collection for related/other sections
  let parentSub: Subcollection | undefined;
  let parentCollectionSubs: Subcollection[] = [];
  for (const col of collections) {
    for (const s of col.subcollections) {
      if (s.subsubcollections.some((ss) => ss.id === subsub.id)) {
        parentSub = s;
        parentCollectionSubs = col.subcollections;
        break;
      }
    }
    if (parentSub) break;
  }

  const relatedSubsubs: SubSubcollection[] = (parentSub?.subsubcollections || []).filter(
    (ss) => ss.id !== subsub.id,
  );
  const otherSubcollections: Subcollection[] = parentCollectionSubs.filter(
    (s) => s.id !== parentSub?.id,
  );

  const getSubsubPreviews = (ss: SubSubcollection): string[] =>
    ss.colorGroups.flatMap((cg) => cg.images.map((i) => i.src));

  const getSubcollectionPreviews = (s: Subcollection): string[] =>
    s.subsubcollections.flatMap(getSubsubPreviews);

  const pageTitle = `${subsub.title} Wallpapers (HD & 4K) – Free Download`;
  const pageDescription = `Explore our ${subsub.title.toLowerCase()} wallpapers in HD and 4K resolution. These aesthetic wallpapers are perfect for iPhone, Android and desktop screens. Download them for free and give your device a clean minimal look. ${totalImages} high quality wallpapers available.`;
  const pageUrl = `${DOMAIN}/collection/${subsub.slug}`;
  const pageImage = subsub.colorGroups[0]?.images[0]?.src || "";

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
              <span className="text-foreground">{subsub.title}</span>
            </nav>

            <h1 className="text-2xl md:text-4xl font-bold text-foreground">{subsub.title}</h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl">
              {pageDescription}
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

        {/* Ad slot top */}
        <div className="container py-4">
          <AdSlot location="collection-top" />
        </div>

        {/* Color groups with sliders */}
        <section className="py-8">
          <div className="container space-y-12">
            {subsub.colorGroups.map((colorGroup) => (
              <div key={colorGroup.id} id={colorGroup.anchorId} className="scroll-mt-20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-foreground">{colorGroup.title}</h2>
                  <Button variant="lavender" size="sm" asChild>
                    <a href={subsub.downloadLink} target="_blank" rel="noopener noreferrer">
                      Download Full Collection
                    </a>
                  </Button>
                </div>
                <ColorGroupSlider colorGroup={colorGroup} pageUrl={pageUrl} />
              </div>
            ))}
          </div>
        </section>

        {/* Ad slot bottom */}
        <div className="container py-4">
          <AdSlot location="collection-bottom" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubSubcollectionPage;
