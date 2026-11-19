import FoodCard from "./FoodCard";

export default function FoodSection({ category, foods }) {
  if (!foods.length) return null;

  return (
    <section className="mb-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Menu</p>
          <h2 className="mt-1 text-2xl font-black sm:text-3xl">{category}</h2>
        </div>
        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-400">
          {foods.length} {foods.length === 1 ? "item" : "items"}
        </span>
      </div>
      <div className="mb-6 h-px w-full bg-linear-to-r from-emerald-600/70 via-zinc-700 to-transparent" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
        {foods.map((food) => (
          <FoodCard food={food} key={food.id || food._id} />
        ))}
      </div>
    </section>
  );
}
