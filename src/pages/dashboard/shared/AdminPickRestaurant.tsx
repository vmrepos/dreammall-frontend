import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserSecret } from "@fortawesome/free-solid-svg-icons"
import { ImpersonationControls } from "./ImpersonationControls"

export const AdminPickRestaurant = () => (
  <div className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
    <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-brand-light text-brand">
      <FontAwesomeIcon icon={faUserSecret} className="size-6" aria-hidden />
    </div>
    <h2 className="text-lg font-semibold text-gray-900">Elegí un restaurante</h2>
    <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
      Tu cuenta admin no está ligada a un local. Entrá como un restaurante para editar su menú.
    </p>
    <div className="mt-6 w-full max-w-xs">
      <ImpersonationControls variant="sheet" />
    </div>
  </div>
)
