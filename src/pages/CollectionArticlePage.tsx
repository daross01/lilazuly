import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ImageModal from "@/components/ImageModal";
import SocialShareButtons from "@/components/SocialShareButtons";
import { getColorPage } from "@/data/collections";
import { collections, type ColorGroup } from "@/data/collections";
import ColorGroupCard from "@/components/ColorGroupCard";
import { buildArticleContent } from "@/data/collectionContent";

const DOMAIN = "https://lilazuly.vercel.app";

const CollectionArticlePage = () => {
  const { collection: collectionSlug, subcategory, color } = useParams<{
    collection: string;
    subcategory: string;
    color: string;
  }>();
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  const ctx = getColorPage(collectionSlug || "", subcategory || "", color || "");

  if (!ctx) return <Navigate to="/" replace />;

  const { collection, subsubcollection, colorGroup } = ctx;
  const article = buildArticleContent(ctx);

  // Related: sibling color groups in the same subsubcollection (excluding current).
  const relatedGroups = subsubcollection.colorGroups.filter((g) => g.id !== colorGroup.id);

  // Explore: top-level subcollections from the Home (all of them, excluding current subcollection).
  // Reuse ColorGroupCard by synthesizing a ColorGroup-like object per subcollection.
  const homeCollection = collections[0];
  const exploreItems: { key: string; card: ColorGroup; href: string }[] = [];
  if (homeCollection) {
    for (const sub of homeCollection.subcollections) {
      const allImages = sub.subsubcollections.flatMap((ss) =>
        ss.colorGroups.flatMap((cg) => cg.images)
      );
      if (allImages.length === 0) continue;
      exploreItems.push({
        key: sub.id,
        card: {
          id: sub.id,
          slug: sub.anchorId,
          anchorId: sub.anchorId,
          title: sub.title,
          url: `/#${sub.anchorId}`,
          images: allImages,
        },
        href: `/#${sub.anchorId}`,
      });
    }
  }

  const pageUrl = `${DOMAIN}${colorGroup.url}`;
  const ogImage = colorGroup.images[0]
    ? (colorGroup.images[0].src.startsWith("http") ? colorGroup.images[0].src : `${DOMAIN}${colorGroup.images[0].src}`)
    : "";

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{article.seo.title}</title>
        <meta name="description" content={article.seo.description} />
        <link rel="canonical" href={colorGroup.url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.seo.title} />
        <meta property="og:description" content={article.seo.description} />
        <meta property="og:url" content={colorGroup.url} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.seo.title} />
        <meta name="twitter:description" content={article.seo.description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.seo.description,
            image: ogImage || undefined,
            mainEntityOfPage: pageUrl,
          })}
        </script>
      </Helmet>

      <Header />

      <main className="flex-1">
        <article className="mx-auto w-full max-w-[780px] px-5 md:px-6 py-10 md:py-16">
          {/* Breadcrumb */}
          <nav
            className="text-xs text-muted-foreground mb-8 flex flex-wrap items-center gap-x-1.5 gap-y-1"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span>{collection.title}</span>
            <span>/</span>
            <span>{subsubcollection.title}</span>
            <span>/</span>
            <span className="text-foreground">{colorGroup.title}</span>
          </nav>

          {/* Title + subtitle */}
          <header className="mb-10 md:mb-14">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
              {collection.title} · {subsubcollection.title}
            </p>
            <h1 className="text-3xl md:text-5xl font-semibold text-foreground leading-[1.1] tracking-tight">
              {article.title}
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              {article.subtitle}
            </p>
            <div className="mt-6">
              <SocialShareButtons
                url={pageUrl}
                title={article.seo.title}
                description={article.seo.description}
                image={ogImage}
              />
            </div>
          </header>

          {/* Intro */}
          <p className="text-[17px] md:text-lg text-foreground/90 leading-[1.75] first-letter:text-5xl first-letter:font-semibold first-letter:mr-2 first-letter:float-left first-letter:leading-[0.95] first-letter:mt-1">
            {article.intro}
          </p>

          {/* Sections: one per wallpaper, same pattern throughout */}
          <div className="mt-16 md:mt-24 space-y-20 md:space-y-28">
            {article.sections.map((section, i) => (
              <section key={i} className="flex flex-col items-center text-center">
                <figure className="mb-8 md:mb-10 w-full flex justify-center">
                  <button
                    type="button"
                    onClick={() => setModalImage({ src: section.image.src, alt: section.image.alt })}
                    className="block w-[70%] md:w-[65%] max-w-[420px] overflow-hidden rounded-2xl bg-secondary shadow-card hover:shadow-card-hover transition-shadow"
                    aria-label={`Preview ${section.image.alt}`}
                  >
                    <img
                      src={section.image.src}
                      alt={section.image.alt}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="w-full h-auto object-cover"
                    />
                  </button>
                </figure>
                <p className="max-w-[560px] text-[17px] md:text-lg text-foreground/90 leading-[1.75]">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          {/* Conclusion */}
          <section className="mt-14 md:mt-20 pt-10 border-t border-border">
            <p className="text-[17px] md:text-lg text-foreground/90 leading-[1.75]">
              {article.conclusion}
            </p>
          </section>

          {/* Download CTA */}
          <div className="mt-10 md:mt-14 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center">
            <Button variant="hero" size="lg" asChild>
              <a href={subsubcollection.downloadLink} target="_blank" rel="noopener noreferrer">
                Download the full collection
              </a>
            </Button>
          </div>
        </article>

        {/* Related Wallpapers */}
        {relatedGroups.length > 0 && (
          <section className="border-t border-border py-14 md:py-20">
            <div className="mx-auto w-full max-w-[1100px] px-5 md:px-6">
              <div className="mb-8 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
                  Related Wallpapers
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  More colors from the {subsubcollection.title} · {collection.title} set.
                </p>
              </div>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
                {relatedGroups.map((g) => (
                  <div key={g.id} className="flex-shrink-0 w-44 md:w-48 snap-start">
                    <Link to={g.url} onClick={() => window.scrollTo(0, 0)}>
                      <ColorGroupCard colorGroup={g} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Explore Other Collections */}
        {exploreItems.length > 0 && (
          <section className="border-t border-border py-14 md:py-20">
            <div className="mx-auto w-full max-w-[1100px] px-5 md:px-6">
              <div className="mb-8 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
                  Explore Other Collections
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Jump back to the home and discover more curated collections.
                </p>
              </div>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
                {exploreItems.map(({ key, card, href }) => (
                  <div key={key} className="flex-shrink-0 w-44 md:w-48 snap-start">
                    <Link to={href}>
                      <ColorGroupCard colorGroup={card} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer />

      {modalImage && (
        <ImageModal
          src={modalImage.src}
          alt={modalImage.alt}
          onClose={() => setModalImage(null)}
        />
      )}
    </div>
  );
};

export default CollectionArticlePage;
