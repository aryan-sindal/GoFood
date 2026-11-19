import { Edit3, Trash2 } from "lucide-react";

export default function RestaurantFoodCard({ food, onEdit, onDelete }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-4/3 overflow-hidden bg-zinc-100">
        <img
          src={food.img}
          alt={food.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-extrabold text-zinc-900">{food.name}</h3>
        <p className="mt-1 min-h-10 line-clamp-2 text-sm leading-5 text-zinc-500">
          {food.description || "No description added."}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {food.options?.map((option, index) => (
            <span key={`${option.type}-${index}`} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              {option.type} · ₹{option.price}
            </span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => onEdit(food)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
          >
            <Edit3 size={16} /> Edit
          </button>
          <button
            onClick={() => onDelete(food)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </article>
  );
}
