import { useState } from "react"
import { faUtensils } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { cn } from "../../utils/format"
import { resolveMediaUrl } from "../../utils/mediaUrl"

type Props = {
  imageUrl?: string | null
  className?: string
}

export const ProductThumb = ({ imageUrl, className }: Props) => {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const resolved = resolveMediaUrl(imageUrl)
  const src = resolved && failedUrl === resolved ? null : resolved

  return (
    <span
      className={cn(
        "relative size-16 shrink-0 overflow-hidden rounded-xl bg-brand-light",
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="size-full object-cover"
          onError={() => setFailedUrl(resolved)}
        />
      ) : (
        <span className="flex size-full items-center justify-center text-brand">
          <FontAwesomeIcon icon={faUtensils} className="size-5" aria-hidden />
        </span>
      )}
    </span>
  )
}
