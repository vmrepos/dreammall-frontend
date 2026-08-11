import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpen, faPlus } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../components/atoms/Button"

import { PageHeader } from "../../../../components/molecules/PageHeader"
import { useMenuContext } from "../../../../context/MenuContext"
import { MenuThumbnail } from "../shared/MenuThumbnail"
import { EmptyList } from "../../../../components/molecules/EmptyList"


export const Page = () => {
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
        <EmptyList
          icon={faBookOpen}
          title="Sin menús todavía"
          description="Cuando crees un menú, aparecerá aquí con su estado y detalles."
          actionUrl="/menu/new"
          actionText="Crear primer menú"
        />
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
