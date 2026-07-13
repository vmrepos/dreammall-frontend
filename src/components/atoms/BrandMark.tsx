type BrandMarkProps = {
  className?: string
}

/** Subtle tricolor cue — reads as local without waving a flag. */
export const BrandMark = ({ className = "" }: BrandMarkProps) => (
  <span className={`inline-flex items-center gap-1 ${className}`} aria-hidden>
    <span className="size-1.5 rounded-full bg-accent-clay" />
    <span className="size-1.5 rounded-full bg-accent-sun" />
    <span className="size-1.5 rounded-full bg-brand" />
  </span>
)
