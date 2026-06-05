// Small floating banner for success/error messages.
type BannerProps = {
  message: string;
  type?: "success" | "error";
};

function Banner({
  message,
  type = "success",
}: BannerProps) {
  if (!message) return null;

  return (
    <div
      className={`
        fixed
        top-4
        right-88
        px-6
        py-3
        rounded-xl
        shadow-lg
        text-white
        z-50
        transition-all
        duration-300
        ${
          type === "success"
            ? "bg-green-600"
            : "bg-red-600"
        }
      `}
    >
      {message}
    </div>
  );
}

export default Banner;