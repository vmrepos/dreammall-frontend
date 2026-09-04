import { useEffect, useState } from "react"
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
import { useRestaurant } from "../../../context/RestaurantContext"
import type { TRestaurantForm } from "../../../types/Restaurant"
import { Notification } from "../../../components/atoms/Notification"
import { formatCoords, parseCoords } from "../../../utils/format"
import { revokePreviewIfBlob } from "../../../utils/utils"
import { LogoField } from "./LogoField"
import { PaymentQrField } from "./PaymentQrField"

export const Page = () => {
  const { restaurant, loading, updateRestaurant } = useRestaurant()
  const [profile, setProfile] = useState<TRestaurantForm | null>(null)
  const [coordsInput, setCoordsInput] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [removeLogo, setRemoveLogo] = useState(false)
  const [logoError, setLogoError] = useState("")
  const [qrFile, setQrFile] = useState<File | null>(null)
  const [qrPreview, setQrPreview] = useState<string | null>(null)
  const [removeQr, setRemoveQr] = useState(false)
  const [qrError, setQrError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!restaurant) return
    setProfile({
      name: restaurant.name,
      address: restaurant.address,
      whatsapp: restaurant.whatsapp,
      email: restaurant.email,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      open_time: restaurant.open_time,
      close_time: restaurant.close_time,
    })
    setCoordsInput(formatCoords(restaurant.latitude, restaurant.longitude))
    setLogoFile(null)
    setLogoPreview((current) => {
      revokePreviewIfBlob(current)
      return null
    })
    setRemoveLogo(false)
    setLogoError("")
    setQrFile(null)
    setQrPreview((current) => {
      revokePreviewIfBlob(current)
      return null
    })
    setRemoveQr(false)
    setQrError("")
  }, [restaurant])

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!profile) return

    setIsSaving(true)
    setSaved(false)
    try {
      await updateRestaurant({
        ...profile,
        ...(logoFile ? { logo: logoFile } : {}),
        ...(removeLogo && !logoFile ? { logo: null } : {}),
        ...(qrFile ? { payment_qr: qrFile } : {}),
        ...(removeQr && !qrFile ? { payment_qr: null } : {}),
      })
      setSaved(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || !profile) return <div>Cargando...</div>

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        icon={faStore}
        section="Cuenta"
        title="Perfil del comercio"
        description="Actualiza la información pública y de contacto de tu restaurante."
      />

      {saved && <Notification text="Cambios guardados correctamente." />}

      <Card padding="lg">
        <form className="grid gap-5" onSubmit={handleSave}>
          <FormField
            id="name"
            label="Nombre del comercio"
            icon={faStore}
            value={profile.name ?? ""}
            onChange={(ev) => setProfile({ ...profile, name: ev.target.value })}
            required
          />
          <FormField
            id="address"
            label="Dirección"
            icon={faLocationDot}
            value={profile.address ?? ""}
            onChange={(ev) => setProfile({ ...profile, address: ev.target.value })}
            required
          />
          <FormField
            id="whatsapp"
            label="WhatsApp"
            icon={faPhone}
            value={profile.whatsapp ?? ""}
            onChange={(ev) => setProfile({ ...profile, whatsapp: ev.target.value })}
            required
          />
          <FormField
            id="email"
            label="Correo electrónico"
            icon={faEnvelope}
            type="email"
            value={profile.email ?? ""}
            onChange={(ev) => setProfile({ ...profile, email: ev.target.value })}
          />
          <FormField
            id="latitude"
            label="Coordenadas"
            icon={faLocationDot}
            placeholder="-17.7833, -63.1821"
            value={coordsInput}
            onChange={(ev) => {
              const value = ev.target.value
              setCoordsInput(value)
              setProfile({ ...profile, ...parseCoords(value) })
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

          <div className="border-t border-gray-100 pt-5">
            <LogoField
              existingUrl={restaurant?.logo_url}
              file={logoFile}
              preview={logoPreview}
              pendingRemoval={removeLogo}
              error={logoError}
              onFileChange={(file, preview) => {
                revokePreviewIfBlob(logoPreview)
                setLogoFile(file)
                setLogoPreview(preview)
                setRemoveLogo(false)
              }}
              onRemove={() => {
                revokePreviewIfBlob(logoPreview)
                setLogoFile(null)
                setLogoPreview(null)
                setRemoveLogo(Boolean(restaurant?.logo_url) && !logoFile)
                setLogoError("")
              }}
              onError={setLogoError}
            />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <PaymentQrField
              existingUrl={restaurant?.payment_qr_url}
              file={qrFile}
              preview={qrPreview}
              pendingRemoval={removeQr}
              error={qrError}
              onFileChange={(file, preview) => {
                revokePreviewIfBlob(qrPreview)
                setQrFile(file)
                setQrPreview(preview)
                setRemoveQr(false)
              }}
              onRemove={() => {
                revokePreviewIfBlob(qrPreview)
                setQrFile(null)
                setQrPreview(null)
                setRemoveQr(Boolean(restaurant?.payment_qr_url) && !qrFile)
                setQrError("")
              }}
              onError={setQrError}
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
