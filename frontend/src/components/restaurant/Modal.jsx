import { X } from "lucide-react";

export default function Modal({ title, description, onClose, children, maxWidth = "max-w-lg" }) {
  return (
    <div className="fixed inset-0 z-100 grid place-items-center bg-zinc-950/60 p-4 backdrop-blur-sm">
      <div className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl`}>
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-zinc-100 bg-white p-5">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
