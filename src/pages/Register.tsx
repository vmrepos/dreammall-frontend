import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faArrowRight,
  faBuilding,
  faCheck,
  faEnvelope,
  faLock,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import { BrandMark } from "../components/atoms/BrandMark"
import { Button } from "../components/atoms/Button"
import { Card } from "../components/atoms/Card"
import { FormField } from "../components/molecules/FormField"
import type { TUserCreateForm, TUserForm } from "../types/User"
import type { TRestaurantForm } from "../types/Restaurant"
import { apiClient } from "../services/apiClient"



const steps = [
  { id: 1, label: "Cuenta", icon: faUser },
  { id: 2, label: "Comercio", icon: faBuilding },
  { id: 3, label: "Confirmar", icon: faCheck },
] as const

const emptyUser: TUserForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  password: "",
  password_confirmation: "",
}

const emptyRestaurant: TRestaurantForm = {
  name: "",
  nit: "",
  address: "",
  whatsapp: "",
  email: "",
}

export const Register = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [user, setUser] = useState<TUserForm>(emptyUser)
  const [restaurant, setRestaurant] = useState<TRestaurantForm>(emptyRestaurant)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateAccount = (field: keyof TUserForm, value: string) =>
    setUser((current) => ({ ...current, [field]: value }))

  const updateRestaurant = (field: keyof TRestaurantForm, value: string) =>
    setRestaurant((current) => ({ ...current, [field]: value }))

  const handleSubmit = async () => {
    const data: TUserCreateForm = { user, restaurant }
    setIsSubmitting(true)
    apiClient.users.createAccount(data)
      .then(() => {
        navigate("/login", { replace: true })
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-surface px-8 py-8">
      <div className="w-full max-w-2xl">
        <div className="mb-6 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center rounded-full bg-brand-light px-3 py-1.5 text-[13px] font-semibold text-brand">
              Dream Mall · Comercio
            </span>
            <BrandMark />
          </div>
          <h1 className="text-[1.75rem] font-bold text-brand">Registrar comercio</h1>
          <p className="mt-2 text-[15px] text-ink-muted">Crea tu cuenta y configura tu restaurante</p>
        </div>

        <div className="mb-8 flex items-center justify-center gap-3">
          {steps.map(({ id, label, icon }) => (
            <div key={id} className="flex items-center gap-3">
              <div
                className={[
                  "flex size-10 items-center justify-center rounded-full text-sm font-bold",
                  step >= id ? "bg-brand text-white" : "bg-gray-200 text-gray-500",
                ].join(" ")}
              >
                <FontAwesomeIcon icon={icon} className="size-4" aria-hidden />
              </div>
              <span className={step >= id ? "text-sm font-semibold text-gray-900" : "text-sm text-gray-400"}>
                {label}
              </span>
              {id < steps.length && <div className="h-px w-8 bg-gray-200" />}
            </div>
          ))}
        </div>

        <Card padding="lg">
          {step === 1 && (
            <div className="grid gap-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  id="first_name"
                  label="Nombre"
                  value={user.first_name}
                  onChange={(ev) => updateAccount("first_name", ev.target.value)}
                  required
                />
                <FormField
                  id="last_name"
                  label="Apellido"
                  value={user.last_name}
                  onChange={(ev) => updateAccount("last_name", ev.target.value)}
                  required
                />
              </div>
              <FormField
                id="username"
                label="Nombre de usuario"
                icon={faUser}
                type="text"
                value={user.username}
                onChange={(ev) => updateAccount("username", ev.target.value)}
                required
              />
              <FormField
                id="email"
                label="Correo electrónico"
                icon={faEnvelope}
                type="email"
                value={user.email}
                onChange={(ev) => updateAccount("email", ev.target.value)}
                required
              />
              <FormField
                id="phone_number"
                label="Teléfono"
                icon={faPhone}
                value={user.phone_number}
                onChange={(ev) => updateAccount("phone_number", ev.target.value)}
                required
              />
              <FormField
                id="password"
                label="Contraseña"
                icon={faLock}
                type="password"
                value={user.password}
                onChange={(ev) => updateAccount("password", ev.target.value)}
                required
              />
              <FormField
                id="password_confirmation"
                label="Confirmar contraseña"
                icon={faLock}
                type="password"
                value={user.password_confirmation}
                onChange={(ev) => updateAccount("password_confirmation", ev.target.value)}
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-5">
              <FormField
                id="restaurant_name"
                label="Nombre del comercio"
                value={restaurant.name}
                onChange={(ev) => updateRestaurant("name", ev.target.value)}
                required
              />
              <FormField
                id="nit"
                label="NIT"
                value={restaurant.nit}
                onChange={(ev) => updateRestaurant("nit", ev.target.value)}
                required
              />
              <FormField
                id="address"
                label="Dirección"
                value={restaurant.address}
                onChange={(ev) => updateRestaurant("address", ev.target.value)}
                required
              />
              <FormField
                id="whatsapp"
                label="WhatsApp"
                icon={faPhone}
                value={restaurant.whatsapp}
                onChange={(ev) => updateRestaurant("whatsapp", ev.target.value)}
                required
              />
              <FormField
                id="restaurant_email"
                label="Correo del comercio"
                icon={faEnvelope}
                type="email"
                value={restaurant.email}
                onChange={(ev) => updateRestaurant("email", ev.target.value)}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <section>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand">Cuenta</h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Nombre</dt>
                    <dd className="font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Correo</dt>
                    <dd className="font-medium text-gray-900">{user.email}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Teléfono</dt>
                    <dd className="font-medium text-gray-900">{user.phone_number}</dd>
                  </div>
                </dl>
              </section>
              <section>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand">Comercio</h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Nombre</dt>
                    <dd className="font-medium text-gray-900">{restaurant.name}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">NIT</dt>
                    <dd className="font-medium text-gray-900">{restaurant.nit}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Dirección</dt>
                    <dd className="text-right font-medium text-gray-900">{restaurant.address}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">WhatsApp</dt>
                    <dd className="font-medium text-gray-900">{restaurant.whatsapp}</dd>
                  </div>
                </dl>
              </section>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-4">
            {step > 1 ? (
              <Button variant="secondary" onClick={() => setStep((current) => current - 1)}>
                <FontAwesomeIcon icon={faArrowLeft} className="size-4" aria-hidden />
                Anterior
              </Button>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-gray-500 transition hover:text-brand"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            )}

            {step < 3 ? (
              <Button onClick={() => setStep((current) => current + 1)}>
                Siguiente
                <FontAwesomeIcon icon={faArrowRight} className="size-4" aria-hidden />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Confirmar registro"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
