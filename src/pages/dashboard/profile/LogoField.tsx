import { faStore } from "@fortawesome/free-solid-svg-icons"
import { ImageUploadField } from "./ImageUploadField"

type Props = {
  existingUrl?: string | null
  file: File | null
  preview: string | null
  pendingRemoval: boolean
  error: string
  onFileChange: (file: File | null, preview: string | null) => void
  onRemove: () => void
  onError: (error: string) => void
}

export const LogoField = (props: Props) => (
  <ImageUploadField
    id="restaurant-logo"
    label="Logo del comercio"
    hint="Se muestra en el menú que ven tus clientes."
    emptyCta="Subir logo"
    currentLabel="Logo actual"
    removeLabel="Quitar logo"
    previewAlt="Logo del comercio"
    icon={faStore}
    imageClassName="size-28 rounded-xl border border-gray-200 object-cover bg-white"
    {...props}
  />
)
