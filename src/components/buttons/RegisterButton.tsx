import Link from "next/link";

interface RegisterButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

export default function RegisterButton({
  children,
  className = "",
  variant = "primary",
}: RegisterButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center px-8 py-3 rounded-full font-montserrat font-medium tracking-wide transition-all duration-200";

  const variantStyles = {
    primary:
      "bg-foreground text-background hover:opacity-90 hover:scale-105 shadow-lg hover:shadow-xl",
    secondary:
      "bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background",
  };

  return (
    <Link
      href="https://chat.ruska.ai/login"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
