import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGear, faMapLocationDot, faStopwatch } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { FormField } from "../../../components/molecules/FormField"
import { PageHeader } from "../../../components/molecules/PageHeader"
import type { TRestaurantForm } from "../../../types/Restaurant"
import { useRestaurant } from "../../../context/RestaurantContext"

export const SettingsPage = () => {
  const { restaurant, loading, updateRestaurant } = useRestaurant()
  const [settings, setSettings] = useState<TRestaurantForm | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!restaurant) return
    setSettings({
      delivery_radius: restaurant.delivery_radius,
      prep_time: restaurant.prep_time,
    })
  }, [restaurant])

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!settings) return

    setIsSaving(true)
    setSaved(false)
    try {
      await updateRestaurant(settings)
      setSaved(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || !settings) return <div>Cargando...</div>

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        icon={faGear}
        section="Cuenta"
        title="Configuración"
        description="Ajusta parámetros operativos de tu comercio."
      />

      {saved && (
        <div className="mb-6 rounded-xl bg-brand-light px-4 py-3.5 text-sm text-brand" role="status">
          Cambios guardados correctamente.
        </div>
      )}

      <Card padding="lg">
        <form className="grid gap-6" onSubmit={handleSave}>
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand">
              <FontAwesomeIcon icon={faMapLocationDot} className="size-4" aria-hidden />
              Radio de entrega
            </h2>
            <FormField
              id="delivery_radius_km"
              label="Distancia máxima (km)"
              type="number"
              min={1}
              max={50}
              value={String(settings.delivery_radius ?? "")}
              onChange={(ev) =>
                setSettings({ ...settings, delivery_radius: Number(ev.target.value) })
              }
            />
            <p className="mt-2 text-xs text-gray-500">
              Entregas fuera de este radio no serán aceptadas automáticamente.
            </p>
          </section>

          <section className="border-t border-gray-100 pt-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand">
              <FontAwesomeIcon icon={faStopwatch} className="size-4" aria-hidden />
              Tiempo de preparación
            </h2>
            <FormField
              id="prep_time_minutes"
              label="Minutos estimados"
              type="number"
              min={5}
              max={120}
              value={String(settings.prep_time ?? "")}
              onChange={(ev) =>
                setSettings({ ...settings, prep_time: Number(ev.target.value) })
              }
            />
            <p className="mt-2 text-xs text-gray-500">
              Tiempo promedio que tarda tu cocina en dejar un pedido listo.
            </p>
          </section>

          <div className="flex justify-end border-t border-gray-100 pt-6">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar configuración"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
