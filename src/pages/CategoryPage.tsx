import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CollectionCard from "@/components/CollectionCard";
import { categories, getCollectionsByCategory, getCategoryById } from "@/data/collections";

const DOMAIN = "https://delunevibes.vercel.app";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Category not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const cols = getCollectionsByCategory(category.id);
  const totalWallpapers = cols.reduce(
    (sum, c) => sum + c.subcollections.reduce((s, sub) => s + sub.images.length, 0),
    0
  );

  const pageTitle = `${category.title} Wallpapers (HD & 4K) – Free Download`;
  const pageDescription = `Explore our collection of ${category.title.toLowerCase()} wallpapers in HD and 4K resolution. Discover glow, gradient and minimal wallpapers perfect for iPhone, Android and desktop screens.`;
  const pageUrl = `${DOMAIN}/category/${category.slug}`;
  const otherCategories = categories.filter((c) => c.id !== category.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>
      <Header />
      <main className="flex-1">
        <section className="bg-secondary py-12 md:py-16">
          <div className="container">
            <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foreground">{category.title}</span>
            </nav>
            <h1 className="text-2xl md:text-4xl font-bold text-foreground">{category.title} Wallpapers</h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl">{pageDescription}</p>
          </div>
        </section>

        <section className="py-8">
          <div className="container">
            <p className="text-sm text-muted-foreground mb-6">
              {cols.length} collection{cols.length !== 1 ? "s" : ""} · {totalWallpapers} wallpapers
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {cols.map((c) => (
                <CollectionCard key={c.id} slug={c.slug} title={c.title} subtitle={c.subtitle} previewImages={c.previewImages} />
              ))}
            </div>
          </div>
        </section>

        {otherCategories.length > 0 && (
          <section className="py-12 border-t border-border">
            <div className="container">
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-6">Explore Other Categories</h2>
              <div className="flex flex-wrap gap-3">
                {otherCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="px-4 py-2 rounded-lg bg-secondary text-sm font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
