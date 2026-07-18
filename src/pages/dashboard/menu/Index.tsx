import { useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpen, faImage, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { Input } from "../../../components/atoms/Input"
import { Label } from "../../../components/atoms/Label"
import { PageHeader } from "../../../components/molecules/PageHeader"
import { useMenuCatalog } from "../../../context/MenuCatalogContext"
import { MenuThumbnail } from "./MenuThumbnail"

export const MenusPage = () => {
  const { menus, createMenu } = useMenuCatalog()
  const [menu, setMenu] = useState({ name: "", active: true })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0] ?? null
    setImage(file)

    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(file ? URL.createObjectURL(file) : null)
  }

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleCreate = (ev: React.FormEvent) => {
    ev.preventDefault()
    try {
      createMenu({ ...menu, image })
      setMenu({ name: "", active: true })
      clearImage()
      setShowForm(false)
    } catch (error) {
      console.error(error)
    }

    setShowForm(false)
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-2">
      <PageHeader
        icon={faBookOpen}
        section="Catálogo"
        title="Menús"
        description="Organiza las cartas de tu comercio y administra sus productos."
        action={
          <Button onClick={() => setShowForm((current) => !current)}>
            <FontAwesomeIcon icon={faPlus} className="size-4" aria-hidden />
            Nuevo menú
          </Button>
        }
      />

      {showForm && (
        <Card padding="lg" className="mb-6">
          <form className="flex flex-col gap-4" onSubmit={handleCreate}>
            <div className="flex items-end gap-4">
              <div className="min-w-0 flex-1">
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
              <Button type="submit">Crear menú</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>

            <div>
              <Label htmlFor="menu-image">Imagen (opcional)</Label>
              <input
                ref={fileInputRef}
                id="menu-image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />

              {imagePreview ? (
                <div className="mt-2 flex items-center gap-4">
                  <img
                    src={imagePreview}
                    alt="Vista previa del menú"
                    className="size-20 rounded-xl border border-gray-200 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{image?.name}</p>
                    <button
                      type="button"
                      onClick={clearImage}
                      className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline"
                    >
                      <FontAwesomeIcon icon={faXmark} className="size-3.5" aria-hidden />
                      Quitar imagen
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="menu-image"
                  className="mt-2 flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 bg-surface px-4 py-6 text-sm text-ink-muted transition hover:border-brand hover:text-brand"
                >
                  <FontAwesomeIcon icon={faImage} className="size-4" aria-hidden />
                  Haz clic para subir una imagen del menú
                </label>
              )}
            </div>
          </form>
        </Card>
      )}

      {menus.length === 0 ? (
        <Card>
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-gray-500">No hay menús todavía. Crea el primero para empezar.</p>
          </div>
        </Card>
      ) : (
        <>
          <p className="mb-4 text-sm text-ink-muted">
            <span className="font-semibold text-ink">{menus.length}</span>{" "}
            {menus.length === 1 ? "menú" : "menús"}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {menus.map((menu) => (
              <MenuThumbnail key={menu.id} menu={menu} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
