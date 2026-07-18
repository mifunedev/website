import { ExternalLink } from "lucide-react";
import { OFFERING_URLS } from "@/config/offerings";

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
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-8 py-3 font-montserrat font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus";

  const variantStyles = {
    primary: "bg-green-500 text-black hover:bg-green-400 shadow-lg",
    secondary:
      "bg-transparent border-2 border-green-500 text-oh-accent hover:bg-green-500 hover:text-black",
  };

  return (
    <a
      href={OFFERING_URLS.cloud}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
