import { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "./Modal";

export default function AddCategoryModal({ onClose, onSubmit, loading }) {
  const [name, setName] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmit(name.trim());
  };

  return (
    <Modal title="Add a category" description="Create a menu section for your restaurant." onClose={onClose} maxWidth="max-w-md">
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-zinc-700">Category name</span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Desserts"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />
        </label>

        <button
          disabled={loading || !name.trim()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          {loading ? "Adding..." : "Add category"}
        </button>
      </form>
    </Modal>
  );
}
