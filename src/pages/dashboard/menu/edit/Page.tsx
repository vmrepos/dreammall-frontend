import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faBookOpen } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../components/atoms/Button"
import { Card } from "../../../../components/atoms/Card"
import { PageHeader } from "../../../../components/molecules/PageHeader"
import { useMenuContext } from "../../../../context/MenuContext"
import { apiClient } from "../../../../services/apiClient"
import type { TMenu } from "../../../../types/Menu"
import { MenuFormFields, type MenuImageSelection } from "../shared/MenuFormFields"
import { MenuNotFound } from "../show/NotFound"

export const Page = () => {
  const { menuId } = useParams()
  const navigate = useNavigate()
  const parsedMenuId = Number(menuId)
  const { updateMenu } = useMenuContext()

  const [menu, setMenu] = useState<TMenu | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [image, setImage] = useState<MenuImageSelection>({
    file: null,
    preview: null,
    presetId: null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const data = await apiClient.menus.show(parsedMenuId)
        if (cancelled) return
        setMenu(data)
        setName(data.name)
      } catch {
        if (!cancelled) setMenu(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [parsedMenuId])

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!menu) return

    setSubmitting(true)
    setError(null)

    try {
      await updateMenu(menu.id, {
        name,
        image: image.file ?? undefined,
      })
      navigate(`/menu/${menu.id}`)
    } catch (err) {
      console.error(err)
      setError("No se pudo guardar el menú. Intenta de nuevo.")
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-3xl text-sm text-gray-500">Cargando menú...</div>
  }

  if (!menu) {
    return <MenuNotFound />
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to={`/menu/${menu.id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="size-4" aria-hidden />
        Volver al menú
      </Link>

      <PageHeader
        icon={faBookOpen}
        section="Catálogo"
        title="Editar menú"
        description="Actualiza el nombre o la imagen de esta carta."
      />

      <Card padding="lg">
        <form className="flex flex-col gap-5" onSubmit={(ev) => void handleSave(ev)}>
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <MenuFormFields
            name={name}
            onNameChange={setName}
            image={image}
            onImageChange={setImage}
            existingImageUrl={menu.image_url}
          />

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/menu/${menu.id}`)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
