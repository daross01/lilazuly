import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ColorGroupCard from "@/components/ColorGroupCard";
import EmailSignup from "@/components/EmailSignup";
import AdSlot from "@/components/AdSlot";

import { collections } from "@/data/collections";

const DOMAIN = "https://lilazuly.vercel.app";

const Index = () => {
  // Use the first (and currently only) collection
  const collection = collections[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Lilazuly Wallpapers – Free Aesthetic HD & 4K Wallpapers</title>
        <meta name="description" content="Download free aesthetic wallpapers in HD and 4K resolution for iPhone, Android and desktop. Curated collections updated weekly." />
        <link rel="canonical" href={DOMAIN} />
      </Helmet>
      <Header />
      <main className="flex-1">
        <HeroSection />

        {collection && (
          <section className="py-12">
            <div className="container space-y-12">
              {collection.subcollections.map((sub) => (
                <div key={sub.id} id={sub.anchorId} className="scroll-mt-20">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">{sub.title}</h2>

                  <div className="space-y-8">
                    {sub.subsubcollections.map((subsub) => (
                      <div key={subsub.id} id={subsub.anchorId} className="scroll-mt-20">
                        <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">{subsub.title}</h3>

                        {/* Horizontal scrollable row of color group cards */}
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
                          {subsub.colorGroups.map((colorGroup) => (
                            <div key={colorGroup.id} className="flex-shrink-0 w-44 md:w-48 snap-start">
                              <Link to={colorGroup.url} onClick={() => window.scrollTo(0, 0)}>
                                <ColorGroupCard colorGroup={colorGroup} />
                              </Link>
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
        )}

        <div className="container py-4">
          <AdSlot location="homepage" />
        </div>

        <EmailSignup />

        <section id="about" className="py-16">
          <div className="container text-center max-w-lg mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">About Lilazuly</h2>
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
