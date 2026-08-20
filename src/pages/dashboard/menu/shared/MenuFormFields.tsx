import { useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faImage, faXmark } from "@fortawesome/free-solid-svg-icons"
import { Input } from "../../../../components/atoms/Input"
import { Label } from "../../../../components/atoms/Label"
import { MENU_IMAGE_PRESETS, type MenuImagePresetId } from "../../../../constants/menuImagePresets"
import { revokePreviewIfBlob } from "../../../../utils/utils"
import { resolveMediaUrl } from "../../../../utils/mediaUrl"

export type MenuImageSelection = {
  file: File | null
  preview: string | null
  presetId: MenuImagePresetId | null
}

type Props = {
  name: string
  onNameChange: (name: string) => void
  image: MenuImageSelection
  onImageChange: (next: MenuImageSelection) => void
  /** Existing R2 (or API) URL shown when no new local selection. */
  existingImageUrl?: string | null
}

export const MenuFormFields = ({
  name,
  onNameChange,
  image,
  onImageChange,
  existingImageUrl = null,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [presetError, setPresetError] = useState<string | null>(null)

  const displayPreview = image.preview ?? resolveMediaUrl(existingImageUrl)

  const clearLocalImage = () => {
    revokePreviewIfBlob(image.preview)
    onImageChange({ file: null, preview: null, presetId: null })
    if (fileInputRef.current) fileInputRef.current.value = ""
    setPresetError(null)
  }

  const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0] ?? null
    revokePreviewIfBlob(image.preview)
    setPresetError(null)
    onImageChange({
      file,
      preview: file ? URL.createObjectURL(file) : null,
      presetId: null,
    })
  }

  const selectPreset = async (preset: (typeof MENU_IMAGE_PRESETS)[number]) => {
    setPresetError(null)
    try {
      const response = await fetch(preset.src)
      const blob = await response.blob()
      const file = new File([blob], `${preset.id}.webp`, { type: blob.type || "image/webp" })

      revokePreviewIfBlob(image.preview)
      if (fileInputRef.current) fileInputRef.current.value = ""
      onImageChange({ file, preview: preset.src, presetId: preset.id })
    } catch {
      setPresetError("No se pudo cargar la imagen predeterminada.")
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label htmlFor="menu-name">Nombre del menú</Label>
        <Input
          id="menu-name"
          className="mt-2"
          placeholder="Ej. Menú principal"
          value={name}
          onChange={(ev) => onNameChange(ev.target.value)}
          required
        />
      </div>

      <div>
        <Label>Imagen (opcional)</Label>
        <p className="mt-1 text-sm text-ink-muted">Elige una predeterminada o sube la tuya.</p>

        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {MENU_IMAGE_PRESETS.map((preset) => {
            const selected = image.presetId === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => void selectPreset(preset)}
                className={[
                  "group overflow-hidden rounded-xl border text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                  selected
                    ? "border-brand ring-2 ring-brand/30"
                    : "border-gray-200 hover:border-brand/50",
                ].join(" ")}
              >
                <img src={preset.src} alt="" className="aspect-square w-full object-cover" />
                <span className="block truncate px-1.5 py-1.5 text-center text-xs font-medium text-ink-muted group-hover:text-ink">
                  {preset.label}
                </span>
              </button>
            )
          })}
        </div>

        {presetError && <p className="mt-2 text-sm text-red-600">{presetError}</p>}

        <input
          ref={fileInputRef}
          id="menu-image"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />

        {displayPreview ? (
          <div className="mt-3 flex items-center gap-4">
            <img
              src={displayPreview}
              alt="Vista previa del menú"
              className="size-20 rounded-xl border border-gray-200 object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">
                {image.presetId
                  ? MENU_IMAGE_PRESETS.find((preset) => preset.id === image.presetId)?.label
                  : image.file?.name ?? "Imagen actual"}
              </p>
              <div className="mt-1 flex flex-wrap gap-3">
                <label
                  htmlFor="menu-image"
                  className="cursor-pointer text-sm font-medium text-brand hover:underline"
                >
                  Subir otra
                </label>
                {image.file || image.preview ? (
                  <button
                    type="button"
                    onClick={clearLocalImage}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline"
                  >
                    <FontAwesomeIcon icon={faXmark} className="size-3.5" aria-hidden />
                    {existingImageUrl ? "Descartar cambio" : "Quitar imagen"}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <label
            htmlFor="menu-image"
            className="mt-3 flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 bg-surface px-4 py-6 text-sm text-ink-muted transition hover:border-brand hover:text-brand"
          >
            <FontAwesomeIcon icon={faImage} className="size-4" aria-hidden />
            O sube una imagen propia
          </label>
        )}
      </div>
    </div>
  )
}
