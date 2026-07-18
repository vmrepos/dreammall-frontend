import { useNavigate } from "react-router-dom"
import { Card } from "../../../components/atoms/Card"
import { useMenuCatalog } from "../../../context/MenuCatalogContext"
import type { TMenu } from "../../../types/Menu"
import { faUtensils } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Badge } from "../../../components/atoms/Badge"
import { Toggle } from "../../../components/atoms/Toggle"
type Props = {
  menu: TMenu


}
export const MenuThumbnail: React.FC<Props> = ({ menu }) => {
  const navigate = useNavigate()
  const { patchMenu } = useMenuCatalog()
  return (

    <Card
      key={menu.id}
      className={[
        "transition hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_12px_28px_rgba(12,107,61,0.12)]",
        menu.active ? "" : "border-red-200/80 bg-red-50/40",
      ].join(" ")}
    >
      <button type="button" onClick={() => navigate(`/menu/${menu.id}`)} className="group block w-full cursor-pointer text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
        <div
          className={[
            "relative aspect-square overflow-hidden",
            menu.active
              ? "bg-gradient-to-br from-brand-light via-emerald-50 to-gray-100"
              : "bg-gradient-to-br from-red-100 via-red-50 to-gray-100",
          ].join(" ")}
        >
          {menu.image_url ? (
            <img
              src={`${import.meta.env.VITE_API_URL ?? ""}${menu.image_url}`}
              alt={menu.name}
              className={[
                "absolute inset-0 size-full object-cover",
                menu.active ? "" : "opacity-60 grayscale",
              ].join(" ")}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={[
                  "flex size-10 items-center justify-center rounded-xl shadow-sm backdrop-blur-sm",
                  menu.active
                    ? "bg-white/70 text-brand"
                    : "bg-white/70 text-red-600",
                ].join(" ")}
              >
                <FontAwesomeIcon icon={faUtensils} className="size-4" aria-hidden />
              </span>
            </div>
          )}
          <div className="absolute left-2 top-2">
            <Badge variant={menu.active ? "success" : "danger"}>
              {menu.active ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </div>

        <div className="px-2.5 pt-2.5">
          <h2 className="truncate text-sm font-semibold text-ink">{menu.name}</h2>
          <p className="mt-0.5 text-xs text-ink-muted">
            {menu.products_count}{" "}
            {menu.products_count === 1 ? "producto" : "productos"}
          </p>
        </div>
      </button>

      <div className="flex items-center justify-end px-2.5 pb-2.5 pt-2">
        <Toggle
          checked={menu.active}
          label={`${menu.active ? "Desactivar" : "Activar"} ${menu.name}`}
          onChange={() => patchMenu(menu.id, { active: !menu.active })}
        />
      </div>
    </Card>
  )
}