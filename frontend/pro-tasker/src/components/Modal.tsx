import type { ReactNode } from "react";

// Generic overlay modal used for forms, confirmations, and editing screens.
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
};

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClass =
    size === "sm"
      ? "max-w-sm"
      : size === "lg"
      ? "max-w-2xl"
      : "max-w-md";

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`w-full ${sizeClass} bg-slate-900 border border-slate-800 rounded-lg p-5`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        {(title ) && (
          <div className="flex justify-between items-center mb-4">
            {title && (
              <h2 className="text-base font-semibold text-slate-100">
                {title}
              </h2>
            )}

            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300"
            >
              ✕
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

export default Modal;