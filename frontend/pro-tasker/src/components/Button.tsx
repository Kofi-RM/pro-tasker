type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "danger" | "success";
};

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
}: ButtonProps) {
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    danger:
      "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    success:
      "bg-green-600 hover:bg-green-700 focus:ring-green-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-4 py-2
        rounded-lg
        text-white
        font-medium
        shadow-md
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-lg
        active:translate-y-0
        focus:outline-none
        focus:ring-2
        ${variants[variant]}
      `}
    >
      {children}
    </button>
  );
}

export default Button;