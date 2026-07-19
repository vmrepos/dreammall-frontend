import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpen, faPlus } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { PageHeader } from "../../../components/molecules/PageHeader"
import { useMenuContext } from "../../../context/MenuContext"
import { MenuThumbnail } from "./MenuThumbnail"

export const Index = () => {
  const navigate = useNavigate()
  const { menus } = useMenuContext()

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-2">
      <PageHeader
        icon={faBookOpen}
        section="Catálogo"
        title="Menús"
        description="Organiza las cartas de tu comercio y administra sus productos."
        action={
          <Button onClick={() => navigate("/menu/new")}>
            <FontAwesomeIcon icon={faPlus} className="size-4" aria-hidden />
            Nuevo menú
          </Button>
        }
      />

      {menus.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <p className="text-sm text-gray-500">No hay menús todavía. Crea el primero para empezar.</p>
            <Button className="mt-6" onClick={() => navigate("/menu/new")}>
              <FontAwesomeIcon icon={faPlus} className="size-4" aria-hidden />
              Crear primer menú
            </Button>
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
