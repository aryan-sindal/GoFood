import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Modal from "./Modal";

const emptyOption = { type: "", price: "" };

export default function FoodFormModal({
  onClose,
  onSubmit,
  loading,
  categories,
  initialFood = null,
}) {
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [img, setImg] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([{ ...emptyOption }]);

  useEffect(() => {
    if (initialFood) {
      setCategoryId(String(initialFood.categoryId || ""));
      setName(initialFood.name || "");
      setImg(initialFood.img || "");
      setDescription(initialFood.description || "");
      setOptions(
        initialFood.options?.length
          ? initialFood.options.map((item) => ({
              type: item.type || "",
              price: item.price ?? "",
            }))
          : [{ ...emptyOption }]
      );
    } else {
      setCategoryId(categories[0]?._id || "");
      setName("");
      setImg("");
      setDescription("");
      setOptions([{ ...emptyOption }]);
    }
  }, [initialFood, categories]);

  const changeOption = (index, field, value) => {
    setOptions((old) =>
      old.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addOption = () => setOptions((old) => [...old, { ...emptyOption }]);

  const removeOption = (index) => {
    setOptions((old) => old.filter((_, i) => i !== index));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!categoryId || !name.trim() || !img.trim()) return;

    const cleanOptions = options
      .map((option) => ({
        type: option.type.trim(),
        price: Number(option.price),
      }))
      .filter((option) => option.type && Number.isFinite(option.price) && option.price >= 0);

    if (!cleanOptions.length) {
      return;
    }

    await onSubmit({
      categoryId,
      name: name.trim(),
      img: img.trim(),
      description: description.trim(),
      options: cleanOptions,
    });
  };

  return (
    <Modal
      title={initialFood ? "Update food" : "Add food"}
      description="Keep the menu details clear and accurate for customers."
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">Category</span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">Food name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Farmhouse Pizza"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              required
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-zinc-700">Image URL</span>
          <input
            value={img}
            onChange={(e) => setImg(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            required
          />
        </label>

        {img && (
          <img
            src={img}
            alt="Food preview"
            className="h-40 w-full rounded-xl object-fill"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        )}

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-zinc-700">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe the dish..."
            className="w-full resize-none rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />
        </label>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold text-zinc-700">Sizes / options</span>
            <button
              type="button"
              onClick={addOption}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
            >
              <Plus size={16} /> Add option
            </button>
          </div>

          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="grid grid-cols-[1fr_120px_40px] gap-2">
                <input
                  value={option.type}
                  onChange={(e) => changeOption(index, "type", e.target.value)}
                  placeholder="Regular"
                  className="rounded-xl border border-zinc-300 px-3 py-2.5 outline-none focus:border-emerald-500"
                  required
                />
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={option.price}
                  onChange={(e) => changeOption(index, "price", e.target.value)}
                  placeholder="Price"
                  className="rounded-xl border border-zinc-300 px-3 py-2.5 outline-none focus:border-emerald-500"
                  required
                />
                <button
                  type="button"
                  disabled={options.length === 1}
                  onClick={() => removeOption(index)}
                  className="grid place-items-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                  aria-label="Remove option"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          disabled={loading || !categoryId || !name.trim() || !img.trim()}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : initialFood ? "Save changes" : "Add food"}
        </button>
      </form>
    </Modal>
  );
}
