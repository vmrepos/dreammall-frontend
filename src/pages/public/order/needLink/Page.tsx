import { Link } from "react-router-dom"
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
        description="Pide con el enlace que te envió el comercio, o elige un local."
      />
      <p className="mt-6 text-center text-sm text-ink-muted">
        <Link to="/locales" className="font-semibold text-brand underline-offset-2 hover:underline">
          Ver locales
        </Link>
      </p>
    </div>
  </div>
)
