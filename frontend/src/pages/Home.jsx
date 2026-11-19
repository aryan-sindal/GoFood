import { useEffect, useMemo, useState } from "react";
import HeroCarousel from "../components/HeroCarousel";
import FoodSection from "../components/FoodSection";
import { foods as fallbackFoods } from "../data/food";
import { getPublicFoods } from "../services/publicApi";

export default function Home() {
  const [search, setSearch] = useState("");
  const [foods, setFoods] = useState(() => fallbackFoods.map((food) => ({ ...food, restaurantName: food.restaurantName || "GoFood Kitchen" })));
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("fallback");

  useEffect(() => {
    let active = true;

    getPublicFoods()
      .then((res) => {
        const dbFoods = res.data.foods || [];
        if (!active) return;

        if (dbFoods.length) {
          setFoods(dbFoods);
          setSource("database");
        }
      })
      .catch(() => {
        // Keep the original local menu if the API is unavailable.
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const categories = useMemo(
    () => [...new Set(foods.map((food) => food.category).filter(Boolean))],
    [foods]
  );

  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return foods;

    return foods.filter((food) =>
      [food.name, food.category, food.restaurantName, food.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [foods, search]);

  return (
    <>
      <HeroCarousel search={search} setSearch={setSearch} />

      <main className="min-h-[50vh] bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-[6%] lg:py-10">
        <div className="mx-auto max-w-400">
          <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">
                {source === "database" ? "Live restaurant meu" : "GoFood menu"}
              </p>
              <h1 className="mt-1 text-2xl font-black sm:text-3xl">Explore good food near you</h1>
            </div>
            {loading && <span className="text-sm text-zinc-500">Syncing menu...</span>}
          </div>

          {categories.map((category) => (
            <FoodSection
              key={category}
              category={category}
              foods={filteredFoods.filter((food) => food.category === category)}
            />
          ))}

          {!filteredFoods.length && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-14 text-center">
              <h2 className="text-2xl font-black">No food found</h2>
              <p className="mt-2 text-zinc-500">Try another food, category or restaurant name.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
