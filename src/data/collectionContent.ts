// Editorial content generator for color pages.
// All copy is derived from the collection/subcategory/color context.
// To override any specific page, add an entry to `overrides` below keyed by
// `${collectionSlug}/${subcategorySlug}/${colorSlug}`.

import type { ColorPageContext } from "./collections";

export interface ArticleSection {
  heading?: string;
  image: { src: string; alt: string };
  body: string;
}

export interface ArticleContent {
  title: string;              // H1
  subtitle: string;           // dek line
  intro: string;              // opening paragraph
  sections: ArticleSection[]; // alternating image + text
  conclusion: string;
  seo: {
    title: string;
    description: string;
  };
}

type Override = Partial<Omit<ArticleContent, "sections">> & {
  sections?: Array<Partial<ArticleSection>>;
};

const overrides: Record<string, Override> = {
  // Example:
  // "ballon-initial/basic/blue": {
  //   subtitle: "A quiet drift of ocean tones",
  //   intro: "Custom intro here…",
  // },
};

// Color-flavored moods used to seed varied copy
const colorMoods: Record<string, { mood: string; palette: string; vibe: string }> = {
  blue:   { mood: "calm and introspective",  palette: "deep sea, dusk sky and soft cobalt",  vibe: "serene" },
  green:  { mood: "grounded and organic",     palette: "sage, matcha and forest whispers",    vibe: "restorative" },
  lila:   { mood: "romantic and dreamy",      palette: "lavender haze, orchid and violet dusk", vibe: "poetic" },
  pink:   { mood: "warm and playful",         palette: "blush, rose milk and coquette pink",  vibe: "soft" },
  red:    { mood: "bold and cinematic",       palette: "cherry, ruby and velvet crimson",     vibe: "magnetic" },
  yellow: { mood: "sunlit and optimistic",    palette: "butter, honey and afternoon gold",    vibe: "bright" },
};

function pickImages(ctx: ColorPageContext, n: number): { src: string; alt: string }[] {
  const imgs = ctx.colorGroup.images;
  if (imgs.length === 0) return [];
  const out: { src: string; alt: string }[] = [];
  const step = Math.max(1, Math.floor(imgs.length / (n + 1)));
  for (let i = 0; i < n; i++) {
    const img = imgs[Math.min(imgs.length - 1, (i + 1) * step - 1)];
    out.push({ src: img.src, alt: img.alt });
  }
  return out;
}

export function buildArticleContent(ctx: ColorPageContext): ArticleContent {
  const { collection, subsubcollection, colorGroup } = ctx;
  const colorName = colorGroup.title;                    // "Blue"
  const colorKey = colorGroup.slug.toLowerCase();        // "blue"
  const subcategoryName = subsubcollection.title;        // "Basic"
  const collectionName = collection.title;               // "Ballon Initial"
  const count = colorGroup.images.length;

  const mood = colorMoods[colorKey] ?? {
    mood: "unique and expressive",
    palette: "carefully curated tones",
    vibe: "distinctive",
  };

  const title = `${colorName} ${subcategoryName} Wallpapers — ${collectionName}`;
  const subtitle = `A ${mood.vibe} edit of ${colorName.toLowerCase()} wallpapers from the ${subcategoryName} chapter of ${collectionName}.`;

  const intro =
    `There is a particular kind of quiet that ${colorName.toLowerCase()} brings to a screen. ` +
    `Built around ${mood.palette}, this ${subcategoryName.toLowerCase()} edit collects ${count} aesthetic ` +
    `wallpapers designed to feel ${mood.mood} the moment you unlock your phone. It is not a gallery — ` +
    `it is a small mood board you can carry around.`;

  const [img1, img2, img3, img4] = pickImages(ctx, 4);

  const sections: ArticleSection[] = [];
  if (img1) sections.push({
    heading: "The palette",
    image: img1,
    body:
      `Every wallpaper in this set is tuned to the same tonal family: ${mood.palette}. ` +
      `That consistency is what makes them work together — you can switch backgrounds ` +
      `across the week without breaking the atmosphere of your home screen.`,
  });
  if (img2) sections.push({
    heading: "Why it works",
    image: img2,
    body:
      `${colorName} sits somewhere between statement and neutral. Paired with the ${subcategoryName.toLowerCase()} ` +
      `treatment used throughout ${collectionName}, the result is soft enough for everyday use and ` +
      `sharp enough to feel intentional. Icons stay readable, widgets stay legible, mood stays ${mood.vibe}.`,
  });
  if (img3) sections.push({
    heading: "How to style it",
    image: img3,
    body:
      `Try one of these as a lock screen and pair it with a plain home screen in the same family — ` +
      `light or dark depending on the hour. If you use widgets, keep them monochrome; the ${colorName.toLowerCase()} ` +
      `does the talking. The whole set is optimised for HD and 4K displays across iPhone and Android.`,
  });
  if (img4) sections.push({
    heading: "On the device",
    image: img4,
    body:
      `Downloaded at full resolution, these wallpapers hold up beautifully on modern OLED screens. ` +
      `Blacks stay deep, ${colorName.toLowerCase()} stays true, and there is no visible banding in the ` +
      `gradients. Save your favourites, rotate them weekly, and let the palette do its slow work.`,
  });

  const conclusion =
    `That is the ${colorName} chapter of ${subcategoryName} — ${count} wallpapers, one coherent mood. ` +
    `Scroll down to the gallery, tap any image to preview, and download the ones that speak to you. ` +
    `If a full set is more your style, the complete ${collectionName} collection is one click away.`;

  const seo = {
    title: `${colorName} ${subcategoryName} Wallpapers — Free HD & 4K | ${collectionName}`,
    description:
      `Download ${count} free ${colorName.toLowerCase()} ${subcategoryName.toLowerCase()} aesthetic wallpapers ` +
      `from the ${collectionName} collection. HD and 4K for iPhone, Android and desktop.`,
  };

  const key = `${collection.slug}/${subsubcollection.subcategorySlug}/${colorGroup.slug}`;
  const override = overrides[key];
  if (!override) return { title, subtitle, intro, sections, conclusion, seo };

  return {
    title: override.title ?? title,
    subtitle: override.subtitle ?? subtitle,
    intro: override.intro ?? intro,
    conclusion: override.conclusion ?? conclusion,
    seo: { ...seo, ...(override.seo ?? {}) },
    sections: (override.sections ?? []).length
      ? override.sections!.map((s, i) => ({
          heading: s.heading ?? sections[i]?.heading,
          image: s.image ?? sections[i]?.image ?? sections[0].image,
          body: s.body ?? sections[i]?.body ?? "",
        }))
      : sections,
  };
}
