import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faBookOpen } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../components/atoms/Button"
import { Card } from "../../../../components/atoms/Card"
import { PageHeader } from "../../../../components/molecules/PageHeader"
import { useMenuContext } from "../../../../context/MenuContext"
import { MenuFormFields, type MenuImageSelection } from "../shared/MenuFormFields"

export const Page = () => {
  const navigate = useNavigate()
  const { createMenu } = useMenuContext()
  const [name, setName] = useState("")
  const [image, setImage] = useState<MenuImageSelection>({
    file: null,
    preview: null,
    presetId: null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const created = await createMenu({
        name,
        active: true,
        image: image.file,
      })
      navigate(`/r/menu/${created.id}`)
    } catch (err) {
      console.error(err)
      setError("No se pudo crear el menú. Intenta de nuevo.")
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/r/menu"
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
        <form className="flex flex-col gap-5" onSubmit={(ev) => void handleCreate(ev)}>
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <MenuFormFields
            name={name}
            onNameChange={setName}
            image={image}
            onImageChange={setImage}
          />

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
            <Button type="button" variant="secondary" onClick={() => navigate("/r/menu")}>
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
