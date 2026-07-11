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
import { Button } from "../components/atoms/Button"
import { Card } from "../components/atoms/Card"
import { FormField } from "../components/molecules/FormField"

type AccountData = {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  password: string
  password_confirmation: string
}

type RestaurantData = {
  name: string
  nit: string
  address: string
  whatsapp: string
  email: string
}

const steps = [
  { id: 1, label: "Cuenta", icon: faUser },
  { id: 2, label: "Comercio", icon: faBuilding },
  { id: 3, label: "Confirmar", icon: faCheck },
] as const

const emptyAccount: AccountData = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  password: "",
  password_confirmation: "",
}

const emptyRestaurant: RestaurantData = {
  name: "",
  nit: "",
  address: "",
  whatsapp: "",
  email: "",
}

export const Register = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [account, setAccount] = useState<AccountData>(emptyAccount)
  const [restaurant, setRestaurant] = useState<RestaurantData>(emptyRestaurant)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateAccount = (field: keyof AccountData, value: string) =>
    setAccount((current) => ({ ...current, [field]: value }))

  const updateRestaurant = (field: keyof RestaurantData, value: string) =>
    setRestaurant((current) => ({ ...current, [field]: value }))

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSubmitting(false)
    navigate("/login", { replace: true })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-gray-50 px-8 py-8">
      <div className="w-full max-w-2xl">
        <div className="mb-6 text-center">
          <span className="mb-4 inline-flex items-center rounded-full bg-brand-light px-3 py-1.5 text-[13px] font-semibold text-brand">
            Dream Mall · Comercio
          </span>
          <h1 className="text-[1.75rem] font-bold text-brand">Registrar comercio</h1>
          <p className="mt-2 text-[15px] text-gray-500">Crea tu cuenta y configura tu restaurante</p>
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
                  value={account.first_name}
                  onChange={(ev) => updateAccount("first_name", ev.target.value)}
                  required
                />
                <FormField
                  id="last_name"
                  label="Apellido"
                  value={account.last_name}
                  onChange={(ev) => updateAccount("last_name", ev.target.value)}
                  required
                />
              </div>
              <FormField
                id="email"
                label="Correo electrónico"
                icon={faEnvelope}
                type="email"
                value={account.email}
                onChange={(ev) => updateAccount("email", ev.target.value)}
                required
              />
              <FormField
                id="phone_number"
                label="Teléfono"
                icon={faPhone}
                value={account.phone_number}
                onChange={(ev) => updateAccount("phone_number", ev.target.value)}
                required
              />
              <FormField
                id="password"
                label="Contraseña"
                icon={faLock}
                type="password"
                value={account.password}
                onChange={(ev) => updateAccount("password", ev.target.value)}
                required
              />
              <FormField
                id="password_confirmation"
                label="Confirmar contraseña"
                icon={faLock}
                type="password"
                value={account.password_confirmation}
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
                      {account.first_name} {account.last_name}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Correo</dt>
                    <dd className="font-medium text-gray-900">{account.email}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Teléfono</dt>
                    <dd className="font-medium text-gray-900">{account.phone_number}</dd>
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
