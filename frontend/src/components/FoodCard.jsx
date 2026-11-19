import { useState } from "react";
import { ShoppingCart, Store } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function FoodCard({ food }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [optionIndex, setOptionIndex] = useState(0);

  const options = food.options || [];
  const option = options[optionIndex];

  return (
    <article className=" group overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-800 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative aspect-4/3 overflow-hidden bg-zinc-700">
        <img
          src={food.img}
          alt={food.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-lg font-black text-white">{food.name}</h3>
          <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-bold text-emerald-300">
            {food.category}
          </span>
        </div>

        <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
          <Store size={14} />
          <span className="truncate">{food.restaurantName || "GoFood Kitchen"}</span>
        </div>

        {food.description && (
          <p className="mb-4 line-clamp-2 text-sm leading-5 text-zinc-400">{food.description}</p>
        )}

        {options.length ? (
          <>
            <div className="grid grid-cols-[58px_1fr_auto] items-center gap-2 border-t border-zinc-700 pt-3">
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="h-9 rounded-lg bg-emerald-500 px-1 text-sm font-black text-emerald-950 outline-none"
              >
                {[1,2,3,4,5,6,7,8,9,10].map((n) => <option value={n} key={n}>{n}</option>)}
              </select>

              <select
                value={optionIndex}
                onChange={(e) => setOptionIndex(Number(e.target.value))}
                className="h-9 min-w-0 rounded-lg bg-emerald-500 px-2 text-sm font-black capitalize text-emerald-950 outline-none"
              >
                {options.map((item, i) => (
                  <option value={i} key={`${item.type}-${i}`}>{item.type}</option>
                ))}
              </select>

              <span className="whitespace-nowrap text-sm font-black text-white">₹{option.price}</span>
            </div>

            <button
              onClick={() => addToCart(food, option, quantity)}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-black text-emerald-950 transition hover:bg-emerald-400 active:scale-[.98]"
            >
              <ShoppingCart size={17} /> Add to cart
            </button>
          </>
        ) : (
          <p className="rounded-xl bg-zinc-700 px-3 py-2 text-center text-sm font-semibold text-zinc-300">
            Pricing not available
          </p>
        )}
      </div>
    </article>
  );
}
