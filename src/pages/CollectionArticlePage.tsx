import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ImageModal from "@/components/ImageModal";
import SocialShareButtons from "@/components/SocialShareButtons";
import { getColorPage } from "@/data/collections";
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

          {/* Sections: image + body */}
          <div className="mt-12 md:mt-16 space-y-14 md:space-y-20">
            {article.sections.map((section, i) => (
              <section key={i}>
                <figure className="mb-6 md:mb-8">
                  <div className="overflow-hidden rounded-2xl bg-secondary">
                    <img
                      src={section.image.src}
                      alt={section.image.alt}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </figure>
                {section.heading && (
                  <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 tracking-tight">
                    {section.heading}
                  </h2>
                )}
                <p className="text-[17px] md:text-lg text-foreground/90 leading-[1.75]">
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

        {/* Gallery */}
        <section className="border-t border-border py-12 md:py-16">
          <div className="mx-auto w-full max-w-[1100px] px-5 md:px-6">
            <div className="mb-8 md:mb-10 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
                The gallery
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {colorGroup.images.length} wallpapers · tap to preview & download
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {colorGroup.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setModalImage({ src: img.src, alt: img.alt })}
                  className="group relative overflow-hidden rounded-xl bg-secondary aspect-[9/16]"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
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
