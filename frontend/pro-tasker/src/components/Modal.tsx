import { useEffect, useId, type ReactNode } from "react";

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
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

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
      role="presentation"
    >
      <div
        className={`w-full ${sizeClass} bg-slate-900 border border-slate-800 rounded-lg p-5`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        {/* HEADER */}
        {(title ) && (
          <div className="flex justify-between items-center mb-4">
            {title && (
              <h2 id={titleId} className="text-base font-semibold text-slate-100">
                {title}
              </h2>
            )}

            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300"
              aria-label="Close dialog"
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
