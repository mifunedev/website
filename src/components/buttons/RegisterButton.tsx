import Link from "next/link";

interface RegisterButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

export default function RegisterButton({
  children,
  className = "",
  variant = "primary"
}: RegisterButtonProps) {
  // RegisterButton is scoped to dev/footer use only (Launch OpenHarness).
  // It is NOT for use in marketing CTAs (see prd.md CTA rule).
  const baseStyles = "inline-flex items-center justify-center px-8 py-3 rounded-full font-montserrat font-medium tracking-wide transition-all duration-200";

  const variantStyles = {
    primary: "bg-green-500 text-black hover:bg-green-400 shadow-lg hover:shadow-xl",
    secondary: "bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
  };

  return (
    <Link
      href="https://oh.mifune.dev"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
