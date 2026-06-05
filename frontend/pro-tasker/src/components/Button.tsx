type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "success" | "danger" | "ghost";
  className?: string;
};

function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition focus:outline-none";

  const styles = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white",
    success: "bg-green-600 hover:bg-green-500 text-white",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    ghost:
      "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;