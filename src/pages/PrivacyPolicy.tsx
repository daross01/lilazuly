import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <article className="container max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Privacy Policy</h1>
          <div className="mt-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>Last updated: February 2026</p>
            <p>
              At Lilazuly, we value your privacy. This policy explains what information we collect,
              how we use it, and what choices you have.
            </p>
            <h2 className="text-lg font-semibold text-foreground pt-4">Information We Collect</h2>
            <p>
              We may collect your email address when you voluntarily subscribe to our wallpaper packs.
              We also use analytics to understand how visitors use our site.
            </p>
            <h2 className="text-lg font-semibold text-foreground pt-4">How We Use Your Information</h2>
            <p>
              Your email is used solely to send you wallpaper packs and occasional updates.
              We never sell or share your personal information with third parties.
            </p>
            <h2 className="text-lg font-semibold text-foreground pt-4">Cookies</h2>
            <p>
              We use minimal cookies for analytics purposes. You can disable cookies in your browser settings.
            </p>
            <h2 className="text-lg font-semibold text-foreground pt-4">Contact</h2>
            <p>
              If you have questions about this policy, please contact us at hello@lilazuly.com.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
