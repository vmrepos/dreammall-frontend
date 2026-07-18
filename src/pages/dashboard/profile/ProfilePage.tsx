import { useCallback, useEffect, useState } from "react"
import {
  faClock,
  faEnvelope,
  faLocationDot,
  faPhone,
  faStore,
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { FormField } from "../../../components/molecules/FormField"
import { PageHeader } from "../../../components/molecules/PageHeader"

import { apiClient } from "../../../services/apiClient"
import type { TRestaurant, TRestaurantForm } from "../../../types/Restaurant"

export const ProfilePage = () => {
  const [profile, setProfile] = useState<TRestaurant | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const getProfile = useCallback(async () => {
    try {
      setIsLoading(true)
      const profile = await apiClient.restaurants.getProfile()
      setProfile(profile)
    }
    catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getProfile()
  }, [getProfile])

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!profile) return
    setIsSaving(true)
    setSaved(false)
    try {
      const response = await apiClient.restaurants.updateProfile(profile)
      setProfile(response)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
      setSaved(true)
    }
  }

  if (!profile) return <div>Cargando...</div>

  return (
    <div className="mx-auto max-w-3xl">

      <PageHeader
        icon={faStore}
        section="Cuenta"
        title="Perfil del comercio"
        description="Actualiza la información pública y de contacto de tu restaurante."
      />

      {saved && (
        <div className="mb-6 rounded-xl bg-brand-light px-4 py-3.5 text-sm text-brand" role="status">
          Cambios guardados correctamente.
        </div>
      )}

      <Card padding="lg">
        <form className="grid gap-5" onSubmit={handleSave}>
          <FormField
            id="name"
            label="Nombre del comercio"
            icon={faStore}
            value={profile.name}
            onChange={(ev) => setProfile({ ...profile, name: ev.target.value })}
            required
          />
          <FormField
            id="address"
            label="Dirección"
            icon={faLocationDot}
            value={profile.address}
            onChange={(ev) => setProfile({ ...profile, address: ev.target.value })}
            required
          />
          <FormField
            id="whatsapp"
            label="WhatsApp"
            icon={faPhone}
            value={profile.whatsapp}
            onChange={(ev) => setProfile({ ...profile, whatsapp: ev.target.value })}
            required
          />
          <FormField
            id="email"
            label="Correo electrónico"
            icon={faEnvelope}
            type="email"
            value={profile.email}
            onChange={(ev) => setProfile({ ...profile, email: ev.target.value })}
          />
          <FormField
            id="latitude"
            label="Coordenadas"
            icon={faLocationDot}
            value={`${profile.latitude}, ${profile.longitude}`}
            onChange={(ev) => {
              const [latitude, longitude] = ev.target.value.split(",")
              setProfile({ ...profile, latitude: parseFloat(latitude), longitude: parseFloat(longitude) })
            }}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="open_time"
              label="Hora de apertura"
              icon={faClock}
              type="time"
              value={profile.open_time ?? ""}
              onChange={(ev) => setProfile({ ...profile, open_time: ev.target.value })}
            />

            <FormField
              id="close_time"
              label="Hora de cierre"
              icon={faClock}
              type="time"
              value={profile.close_time ?? ""}
              onChange={(ev) => setProfile({ ...profile, close_time: ev.target.value })}
            />
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-6">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
