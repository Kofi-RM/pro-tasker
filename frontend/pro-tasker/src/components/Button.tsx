type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "danger" | "success";
  size?: "sm" | "md" | "icon";
};

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
}: ButtonProps) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    icon: "w-7 h-7 p-0 text-sm flex items-center justify-center",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        rounded-md
        text-white
        font-medium
        shadow-sm
        transition-all
        duration-150
        hover:-translate-y-0.5
        hover:shadow-md
        active:translate-y-0
        focus:outline-none
        focus:ring-2
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {children}
    </button>
  );
}

export default Button;