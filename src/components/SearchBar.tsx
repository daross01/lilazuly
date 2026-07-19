import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { getAllColorPages } from "@/data/collections";

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const allPages = useMemo(() => getAllColorPages(), []);

  const results = query.trim().length < 2
    ? []
    : allPages.filter(({ collection, subsubcollection, colorGroup }) => {
        const q = query.toLowerCase();
        return (
          colorGroup.title.toLowerCase().includes(q) ||
          colorGroup.slug.includes(q) ||
          subsubcollection.title.toLowerCase().includes(q) ||
          collection.title.toLowerCase().includes(q)
        );
      }).slice(0, 8);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const go = (url: string) => {
    navigate(url);
    setOpen(false);
    setQuery("");
    window.scrollTo(0, 0);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Search wallpapers"
      >
        <Search size={18} />
      </button>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5">
        <Search size={16} className="text-muted-foreground flex-shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search wallpapers…"
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-36 md:w-52"
          onKeyDown={(e) => {
            if (e.key === "Escape") { setOpen(false); setQuery(""); }
            if (e.key === "Enter" && results.length > 0) go(results[0].colorGroup.url);
          }}
        />
        <button onClick={() => { setOpen(false); setQuery(""); }} className="text-muted-foreground hover:text-foreground">
          <X size={14} />
        </button>
      </div>

      {results.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50">
          {results.map(({ colorGroup, subsubcollection, collection }) => (
            <button
              key={colorGroup.id}
              onClick={() => go(colorGroup.url)}
              className="w-full text-left px-4 py-3 hover:bg-secondary transition-colors border-b border-border last:border-b-0"
            >
              <span className="text-sm font-medium text-foreground">
                {colorGroup.title} · {subsubcollection.title}
              </span>
              <span className="block text-xs text-muted-foreground mt-0.5">
                {collection.title} — {colorGroup.images.length} wallpapers
              </span>
            </button>
          ))}
        </div>
      )}

      {query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-background border border-border rounded-xl shadow-lg z-50 p-4">
          <p className="text-sm text-muted-foreground">No wallpapers found.</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
