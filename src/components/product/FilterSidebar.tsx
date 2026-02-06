"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

const translations = {
  en: { filter: "Filters", sort: "Sort By", categories: "Categories", clear: "Clear",
    options: {
      newest: "Newest Arrivals",
      priceLow: "Price: Low to High",
      priceHigh: "Price: High to Low",
      dresses: "Dresses",
      sets: "Sets",
      abayas: "Abayas",
      collection: "Collection 2025"
    }
  }
};

export default function FilterSidebar({ lang }: { lang: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "";
  // @ts-ignore
  const t = translations[lang] || translations.en;

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    router.push(`/${lang}/collection?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(`/${lang}/collection`);
    setOpen(false);
  };

  return (
    <>
      {/* 🎚 FILTER ICON — HEADER STYLE */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-24 right-8 z-40 p-2 rounded-full border border-black/20 hover:bg-black hover:text-white transition"
        aria-label="Open filters"
      >
        <SlidersHorizontal size={18} />
      </button>

      {/* 🌫 BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}

      {/* 🧺 DRAWER */}
      <aside
        className={`fixed top-0 right-0 h-full w-[340px] bg-[#F4F1EA] z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b">
          <h3 className="font-serif text-sm tracking-widest uppercase">
            {t.filter}
          </h3>
          <button onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-10 overflow-y-auto h-full">

          {/* CATEGORIES */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">
              {t.categories}
            </h4>
            <ul className="space-y-3">
              {[
                { label: t.options.collection, val: "Collection 2025" },
                { label: t.options.dresses, val: "Dresses" },
                { label: t.options.sets, val: "Sets" },
                { label: t.options.abayas, val: "Abayas" }
              ].map(item => (
                <li key={item.val}>
                  <button
                    onClick={() =>
                      updateFilter(
                        "category",
                        currentCategory === item.val ? "" : item.val
                      )
                    }
                    className={`font-serif text-sm ${
                      currentCategory === item.val
                        ? "text-black italic"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* SORT */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">
              {t.sort}
            </h4>
            <div className="space-y-3">
              {[
                { label: t.options.newest, val: "newest" },
                { label: t.options.priceLow, val: "price_asc" },
                { label: t.options.priceHigh, val: "price_desc" }
              ].map(item => (
                <button
                  key={item.val}
                  onClick={() => updateFilter("sort", item.val)}
                  className={`block text-sm ${
                    currentSort === item.val
                      ? "text-black font-medium"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {(currentCategory || currentSort) && (
            <button
              onClick={clearFilters}
              className="text-xs uppercase tracking-widest text-red-500"
            >
              {t.clear}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
