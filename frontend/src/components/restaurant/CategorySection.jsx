import { Edit3, Plus, Trash2 } from "lucide-react";
import RestaurantFoodCard from "./FoodCard";

export default function CategorySection({
  category,
  foods,
  onAddFood,
  onEditFood,
  onDeleteFood,
  onEditCategory,
  onDeleteCategory,
}) {
  return (
    <section className="scroll-mt-24">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-zinc-900 sm:text-2xl">{category.name}</h2>
          <p className="text-sm text-zinc-500">{foods.length} {foods.length === 1 ? "item" : "items"}</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => onEditCategory(category)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-bold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
            <Edit3 size={15} /> Edit
          </button>
          <button onClick={() => onDeleteCategory(category)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-bold text-zinc-500 hover:bg-red-50 hover:text-red-600">
            <Trash2 size={15} /> Delete
          </button>
          <button onClick={() => onAddFood(category)} className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600">
            <Plus size={17} /> Add food
          </button>
        </div>
      </div>

      {foods.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {foods.map((food) => (
            <RestaurantFoodCard
              key={food._id || food.id}
              food={food}
              onEdit={onEditFood}
              onDelete={onDeleteFood}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <p className="font-bold text-zinc-700">No food in this category</p>
          <p className="mt-1 text-sm text-zinc-500">Add your first item to start building the menu.</p>
          <button onClick={() => onAddFood(category)} className="mt-4 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">
            Add food
          </button>
        </div>
      )}
    </section>
  );
}
