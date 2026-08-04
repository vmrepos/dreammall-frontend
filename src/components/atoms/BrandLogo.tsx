import logoDarkBg from "../../assets/logo-pedi2-horizontal-dark.png"
import logoLightBg from "../../assets/logo-pedi2-horizontal-light.png"
import { useTheme } from "../../context/ThemeContext"
import { cn } from "../../utils/format"

type BrandLogoProps = {
  /** `dark` = white mark for dark surfaces (sidebar). `light` = ink mark for light surfaces. `auto` follows theme. */
  variant?: "light" | "dark" | "auto"
  className?: string
  alt?: string
}

export const BrandLogo = ({
  variant = "auto",
  className,
  alt = "Pedi2",
}: BrandLogoProps) => {
  const { isDark } = useTheme()
  const resolved =
    variant === "auto" ? (isDark ? "dark" : "light") : variant
  const src = resolved === "dark" ? logoDarkBg : logoLightBg

  return (
    <img
      src={src}
      alt={alt}
      className={cn("h-12 w-auto max-w-full object-contain object-left", className)}
    />
  )
}
