import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faBookOpen, faImage, faXmark } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { Input } from "../../../components/atoms/Input"
import { Label } from "../../../components/atoms/Label"
import { PageHeader } from "../../../components/molecules/PageHeader"
import { MENU_IMAGE_PRESETS, type MenuImagePresetId } from "../../../constants/menuImagePresets"
import { useMenuContext } from "../../../context/MenuContext"
import { revokePreviewIfBlob } from "../../../utils/utils"

export const New = () => {
  const navigate = useNavigate()
  const { createMenu } = useMenuContext()
  const [menu, setMenu] = useState({ name: "", active: true })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<MenuImagePresetId | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const clearImage = () => {
    revokePreviewIfBlob(imagePreview)
    setImage(null)
    setImagePreview(null)
    setSelectedPreset(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleImageChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0] ?? null
    revokePreviewIfBlob(imagePreview)
    setSelectedPreset(null)
    setImage(file)
    setImagePreview(file ? URL.createObjectURL(file) : null)
  }

  const selectPreset = async (preset: (typeof MENU_IMAGE_PRESETS)[number]) => {
    try {
      const response = await fetch(preset.src)
      const blob = await response.blob()
      const file = new File([blob], `${preset.id}.webp`, { type: blob.type || "image/webp" })

      revokePreviewIfBlob(imagePreview)
      if (fileInputRef.current) fileInputRef.current.value = ""
      setImage(file)
      setImagePreview(preset.src)
      setSelectedPreset(preset.id)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreate = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const created = await createMenu({ ...menu, image })
      navigate(`/menu/${created.id}`)
    } catch (err) {
      console.error(err)
      setError("No se pudo crear el menú. Intenta de nuevo.")
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/menu"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="size-4" aria-hidden />
        Volver a menús
      </Link>

      <PageHeader
        icon={faBookOpen}
        section="Catálogo"
        title="Nuevo menú"
        description="Define el nombre y una imagen para tu carta."
      />

      <Card padding="lg">
        <form className="flex flex-col gap-5" onSubmit={handleCreate}>
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <div>
            <Label htmlFor="menu-name">Nombre del menú</Label>
            <Input
              id="menu-name"
              className="mt-2"
              placeholder="Ej. Menú principal"
              value={menu.name}
              onChange={(ev) => setMenu({ ...menu, name: ev.target.value })}
              required
            />
          </div>

          <div>
            <Label>Imagen (opcional)</Label>
            <p className="mt-1 text-sm text-ink-muted">Elige una predeterminada o sube la tuya.</p>

            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {MENU_IMAGE_PRESETS.map((preset) => {
                const selected = selectedPreset === preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => selectPreset(preset)}
                    className={[
                      "group overflow-hidden rounded-xl border text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                      selected
                        ? "border-brand ring-2 ring-brand/30"
                        : "border-gray-200 hover:border-brand/50",
                    ].join(" ")}
                  >
                    <img
                      src={preset.src}
                      alt=""
                      className="aspect-square w-full object-cover"
                    />
                    <span className="block truncate px-1.5 py-1.5 text-center text-xs font-medium text-ink-muted group-hover:text-ink">
                      {preset.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <input
              ref={fileInputRef}
              id="menu-image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
            />

            {imagePreview ? (
              <div className="mt-3 flex items-center gap-4">
                <img
                  src={imagePreview}
                  alt="Vista previa del menú"
                  className="size-20 rounded-xl border border-gray-200 object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {selectedPreset
                      ? MENU_IMAGE_PRESETS.find((preset) => preset.id === selectedPreset)?.label
                      : image?.name}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-3">
                    <label
                      htmlFor="menu-image"
                      className="cursor-pointer text-sm font-medium text-brand hover:underline"
                    >
                      Subir otra
                    </label>
                    <button
                      type="button"
                      onClick={clearImage}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline"
                    >
                      <FontAwesomeIcon icon={faXmark} className="size-3.5" aria-hidden />
                      Quitar imagen
                    </button>
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

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
            <Button type="button" variant="secondary" onClick={() => navigate("/menu")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creando..." : "Crear menú"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
