import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpen, faPlus, faUtensils } from "@fortawesome/free-solid-svg-icons"
import { Badge } from "../../../components/atoms/Badge"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { Input } from "../../../components/atoms/Input"
import { Label } from "../../../components/atoms/Label"
import { Toggle } from "../../../components/atoms/Toggle"
import { PageHeader } from "../../../components/molecules/PageHeader"
import { useMenuCatalog } from "../../../context/MenuCatalogContext"

export const MenusPage = () => {
  const navigate = useNavigate()
  const { menus, createMenu, patchMenu } = useMenuCatalog()
  const [menu, setMenu] = useState({ name: "", active: true })
  const [showForm, setShowForm] = useState(false)

  const handleCreate = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const name = menu.name.trim()
    if (!name) return

    try {
      await createMenu({ name, active: menu.active })
      setMenu({ name: "", active: true })
      setShowForm(false)
    } catch (error) {
      console.error(error)
    }
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
          <form className="flex items-end gap-4" onSubmit={handleCreate}>
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
              <Card
                key={menu.id}
                className={[
                  "transition hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_12px_28px_rgba(12,107,61,0.12)]",
                  menu.active ? "" : "border-red-200/80 bg-red-50/40",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => navigate(`/menu/${menu.id}`)}
                  className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <div
                    className={[
                      "relative aspect-square overflow-hidden",
                      menu.active
                        ? "bg-gradient-to-br from-brand-light via-emerald-50 to-gray-100"
                        : "bg-gradient-to-br from-red-100 via-red-50 to-gray-100",
                    ].join(" ")}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={[
                          "flex size-10 items-center justify-center rounded-xl shadow-sm backdrop-blur-sm transition group-hover:scale-105",
                          menu.active
                            ? "bg-white/70 text-brand"
                            : "bg-white/70 text-red-600",
                        ].join(" ")}
                      >
                        <FontAwesomeIcon icon={faUtensils} className="size-4" aria-hidden />
                      </span>
                    </div>
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
            ))}
          </div>
        </>
      )}
    </div>
  )
}
