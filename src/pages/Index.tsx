import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import EmailSignup from "@/components/EmailSignup";
import AdSlot from "@/components/AdSlot";
import ColorCard from "@/components/ColorCard";

import { categories, getCollectionsByCategory, COLOR_ORDER } from "@/data/collections";

const DOMAIN = "https://delunevibes.vercel.app";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>DeluneVibes Wallpapers – Free Aesthetic HD & 4K Wallpapers</title>
        <meta name="description" content="Download free aesthetic wallpapers in HD and 4K resolution for iPhone, Android and desktop. Curated collections updated weekly." />
        <link rel="canonical" href={DOMAIN} />
      </Helmet>
      <Header />
      <main className="flex-1">
        <HeroSection />

        <div id="categories">
          {categories.map((category) => {
            const cols = getCollectionsByCategory(category.id);
            if (cols.length === 0) return null;

            return (
              <section key={category.id} className="py-12">
                <div className="container">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                    {category.title}
                  </h1>

                  {cols.map((collection) => (
                    <div key={collection.id} className="mb-10">
                      <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">
                        {collection.title}
                      </h2>
                      <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
                        {COLOR_ORDER.map((color) => {
                          const sub = collection.subcollections.find(
                            (s) => s.anchorId === color.id
                          );
                          return (
                            <ColorCard
                              key={color.id}
                              color={color}
                              collectionSlug={collection.slug}
                              subcollection={sub}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="container py-4">
          <AdSlot location="homepage" />
        </div>

        <EmailSignup />

        <section id="about" className="py-16">
          <div className="container text-center max-w-lg mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">About DeluneVibes</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              We curate the most beautiful aesthetic wallpapers for your phone. Every week we release
              new collections inspired by Pinterest aesthetics, glow up culture and digital minimalism.
              All wallpapers are free to download.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
