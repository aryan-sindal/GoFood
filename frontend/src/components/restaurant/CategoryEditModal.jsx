import { useEffect, useState } from "react";
import Modal from "./Modal";

export default function CategoryEditModal({ category, onClose, onSubmit, loading }) {
  const [name, setName] = useState(category?.name || "");

  useEffect(() => setName(category?.name || ""), [category]);

  const submit = (e) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <Modal title="Rename category" description="The name will also be updated on its food items." onClose={onClose} maxWidth="max-w-md">
      <form onSubmit={submit} className="space-y-4">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />
        <button disabled={loading || !name.trim()} className="w-full rounded-xl bg-zinc-900 px-4 py-3 font-bold text-white disabled:opacity-50">
          {loading ? "Saving..." : "Save category"}
        </button>
      </form>
    </Modal>
  );
}
