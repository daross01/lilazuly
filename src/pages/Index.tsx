import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import EmailSignup from "@/components/EmailSignup";
import AdSlot from "@/components/AdSlot";

import { categories, getCollectionsByCategory } from "@/data/collections";

const DOMAIN = "https://lilazuly.vercel.app";

const Index = () => {
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

        <div id="categories">
          {categories.map((category) => {
            const cols = getCollectionsByCategory(category.id);
            return (
              <CategorySection
                key={category.id}
                title={category.title}
                collections={cols}
              />
            );
          })}
        </div>

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
