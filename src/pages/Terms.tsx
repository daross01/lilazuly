import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <article className="container max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Terms & Conditions</h1>
          <div className="mt-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>Last updated: February 2026</p>
            <p>
              By using DeluneVibes, you agree to the following terms. Please read them carefully.
            </p>
            <h2 className="text-lg font-semibold text-foreground pt-4">Use of Wallpapers</h2>
            <p>
              All wallpapers on this site are provided for personal use only. You may not redistribute,
              sell, or use them for commercial purposes without permission.
            </p>
            <h2 className="text-lg font-semibold text-foreground pt-4">Intellectual Property</h2>
            <p>
              All content on this site, including images, text, and design, is the property of
              DeluneVibes and protected by copyright laws.
            </p>
            <h2 className="text-lg font-semibold text-foreground pt-4">Limitation of Liability</h2>
            <p>
              DeluneVibes is provided "as is." We are not liable for any damages arising
              from your use of this website or its content.
            </p>
            <h2 className="text-lg font-semibold text-foreground pt-4">Contact</h2>
            <p>
              For questions regarding these terms, please contact us at hello@delunevibes.com.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
