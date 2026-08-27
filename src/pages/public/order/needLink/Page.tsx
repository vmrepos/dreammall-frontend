import { faLink } from "@fortawesome/free-solid-svg-icons"
import { BrandLogo } from "../../../../components/atoms/BrandLogo"
import { StatusCard } from "../complete/StatusCard"

export const Page = () => (
  <div className="min-h-svh bg-surface px-4 py-8">
    <div className="mx-auto w-full max-w-lg">
      <BrandLogo className="mb-6 h-12" />
      <StatusCard
        icon={faLink}
        title="Necesitas un enlace"
        description="Pide con el enlace que te envió el comercio. Pedi2 no lista restaurantes."
      />
    </div>
  </div>
)
