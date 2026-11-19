import { useEffect, useState } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { heroImages } from "../data/food";

export default function HeroCarousel({ search, setSearch }) {
  const [index, setIndex] = useState(0);

  function changeSlide(direction) {
    setIndex((prev) =>
      direction === "next"
        ? (prev + 1) % heroImages.length
        : (prev - 1 + heroImages.length) % heroImages.length
    );
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative h-107.5 overflow-hidden bg-zinc-950 sm:h-125 lg:h-140">
      {heroImages.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/55 to-black/20" />

      <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-400 flex-col px-5 pb-10 sm:px-8 lg:px-[6%]">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">Good food. Better mood.</p>
        <h1 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
          Discover your next favorite meal.
        </h1>

        <div className="mt-6 flex w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
          <div className="grid w-12 shrink-0 place-items-center text-zinc-400"><Search size={20} /></div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food, category or restaurant..."
            className="h-14 min-w-0 flex-1 bg-white pr-2 text-sm font-semibold text-zinc-900 outline-none sm:text-base"
          />
          {search && (
            <button onClick={() => setSearch("")} className="grid w-12 place-items-center text-zinc-500 hover:text-red-500" aria-label="Clear search">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <button onClick={() => changeSlide("prev")} aria-label="Previous slide" className="absolute left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-3xl text-white backdrop-blur hover:bg-black/45 sm:left-6">
        <ChevronLeft size={26} strokeWidth={2.5}/>
      </button>
      <button onClick={() => changeSlide("next")} aria-label="Next slide" className="absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-3xl text-white backdrop-blur hover:bg-black/45 sm:right-6">
        <ChevronRight size={26} strokeWidth={2.5}/>
      </button>

      <div className="absolute bottom-4 right-5 z-10 flex gap-1.5 sm:right-8">
        {heroImages.map((src, i) => (
          <button key={src} onClick={() => setIndex(i)} aria-label={`Go to slide ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === index ? "w-7 bg-emerald-400" : "w-2 bg-white/50"}`} />
        ))}
      </div>
    </section>
  );
}
