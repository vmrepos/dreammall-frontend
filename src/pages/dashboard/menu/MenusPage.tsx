import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpen, faPlus } from "@fortawesome/free-solid-svg-icons"
import { Badge } from "../../../components/atoms/Badge"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { Input } from "../../../components/atoms/Input"
import { Label } from "../../../components/atoms/Label"
import { Toggle } from "../../../components/atoms/Toggle"
import { PageHeader } from "../../../components/molecules/PageHeader"
import { useMenuCatalog } from "../../../context/MenuCatalogContext"
import { formatDate } from "../../../utils/format"
import { tableRowLinkClass } from "../../../components/organisms/OrderItemsTable"

export const MenusPage = () => {
  const navigate = useNavigate()
  const { menus, addMenu, toggleMenuActive } = useMenuCatalog()
  const [newMenuName, setNewMenuName] = useState("")
  const [showForm, setShowForm] = useState(false)

  const handleCreate = (ev: React.FormEvent) => {
    ev.preventDefault()
    const name = newMenuName.trim()
    if (!name) return

    addMenu(name)
    setNewMenuName("")
    setShowForm(false)
  }

  return (
    <div className="mx-auto max-w-6xl">
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
                value={newMenuName}
                onChange={(ev) => setNewMenuName(ev.target.value)}
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

      <Card>
        {menus.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-gray-500">No hay menús todavía. Crea el primero para empezar.</p>
          </div>
        ) : (
          <>
            <div className="border-b border-gray-100 px-6 py-4">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{menus.length}</span>{" "}
                {menus.length === 1 ? "menú" : "menús"}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-6 py-3">Nombre</th>
                    <th className="px-6 py-3">Productos</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3">Activo</th>
                    <th className="px-6 py-3">Actualizado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {menus.map((menu) => (
                    <tr
                      key={menu.id}
                      className={tableRowLinkClass}
                      onClick={() => navigate(`/menu/${menu.id}`)}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{menu.name}</td>
                      <td className="px-6 py-4 text-gray-700">{menu.products.length}</td>
                      <td className="px-6 py-4">
                        <Badge variant={menu.active ? "success" : "default"}>
                          {menu.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4" onClick={(ev) => ev.stopPropagation()}>
                        <Toggle
                          checked={menu.active}
                          label={`${menu.active ? "Desactivar" : "Activar"} ${menu.name}`}
                          onChange={(active) => toggleMenuActive(menu.id, active)}
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(menu.updated_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
