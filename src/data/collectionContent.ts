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

const sectionTemplates = [
  (color: string, mood: { mood: string; palette: string; vibe: string }) =>
    `This one leans into the ${mood.vibe} side of ${color.toLowerCase()} — the kind of background that ` +
    `disappears into the rest of your screen and lets your apps breathe. Set it as a lock screen for a week ` +
    `and see how quickly it starts to feel like yours.`,
  (color: string, mood: { mood: string; palette: string; vibe: string }) =>
    `Built around ${mood.palette}, this wallpaper is ${mood.mood} without ever tipping into loud. ` +
    `It reads beautifully on OLED and holds its tone under both light and dark system themes.`,
  (color: string) =>
    `A softer take on ${color.toLowerCase()} — closer to a mood than a statement. Pair it with a minimal ` +
    `home screen and monochrome widgets to let the palette do the talking.`,
  (color: string, mood: { mood: string; palette: string; vibe: string }) =>
    `There is a slow, ${mood.vibe} quality to this frame. The composition leaves room around the clock and ` +
    `notifications, so nothing important gets swallowed by the image.`,
  (color: string) =>
    `If you like your ${color.toLowerCase()} with a little more depth, this is the one. Rich in the shadows, ` +
    `soft in the highlights, and calibrated so gradients stay clean at 4K.`,
  (color: string, mood: { mood: string; palette: string; vibe: string }) =>
    `A quieter member of the set. The ${mood.palette} palette keeps things cohesive with the rest of the ` +
    `collection while still offering its own little atmosphere.`,
  (color: string) =>
    `Almost editorial in feel. Works especially well as a home screen when paired with a lock screen from ` +
    `earlier in this ${color.toLowerCase()} edit — the two hand off nicely.`,
  (color: string, mood: { mood: string; palette: string; vibe: string }) =>
    `${mood.vibe.charAt(0).toUpperCase() + mood.vibe.slice(1)} and unhurried. This wallpaper is a good ` +
    `pick for the days when you want your phone to feel a little less busy.`,
  (color: string) =>
    `A punchier ${color.toLowerCase()} moment. Still tonal, still restrained, but with a bit more presence ` +
    `for when you want the background to be noticed.`,
  (color: string, mood: { mood: string; palette: string; vibe: string }) =>
    `Textural and calm. The kind of ${color.toLowerCase()} wallpaper you set once and forget you set — ` +
    `until someone glances at your phone and asks where it is from.`,
];

function buildImageSections(
  ctx: ColorPageContext,
  mood: { mood: string; palette: string; vibe: string },
  colorName: string,
): ArticleSection[] {
  return ctx.colorGroup.images.map((img, i) => ({
    image: { src: img.src, alt: img.alt },
    body: sectionTemplates[i % sectionTemplates.length](colorName, mood),
  }));
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

  const sections: ArticleSection[] = buildImageSections(ctx, mood, colorName);

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
