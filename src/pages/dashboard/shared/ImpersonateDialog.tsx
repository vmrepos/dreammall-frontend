import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { Input } from "../../../components/atoms/Input"
import type { TRestaurantSummary } from "../../../types/Restaurant"

type Props = {
  open: boolean
  restaurants: TRestaurantSummary[]
  loading: boolean
  query: string
  selecting: boolean
  onQueryChange: (query: string) => void
  onSelect: (id: number) => void
  onClose: () => void
}

export const ImpersonateDialog = ({
  open,
  restaurants,
  loading,
  query,
  selecting,
  onQueryChange,
  onSelect,
  onClose,
}: Props) => {
  if (!open) return null

  const filtered = restaurants.filter((restaurant) => {
    const haystack = `${restaurant.name} ${restaurant.whatsapp} ${restaurant.address}`.toLowerCase()
    return haystack.includes(query.trim().toLowerCase())
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <Card padding="lg" className="flex max-h-[min(32rem,calc(100svh-3rem))] w-full max-w-md flex-col">
        <h2 className="text-lg font-bold text-gray-900">Ver como restaurante</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          Entras al panel de ese local: menú, pedidos y perfil. Solo cuentas admin.
        </p>
        <Input
          className="mt-4"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar por nombre o WhatsApp"
          inputSize="sm"
          disabled={loading || selecting}
        />
        <ul className="mt-3 min-h-0 flex-1 space-y-1 overflow-y-auto">
          {loading && <li className="px-1 py-6 text-center text-sm text-ink-muted">Cargando…</li>}
          {!loading && filtered.length === 0 && (
            <li className="px-1 py-6 text-center text-sm text-ink-muted">No hay restaurantes</li>
          )}
          {!loading &&
            filtered.map((restaurant) => (
              <li key={restaurant.id}>
                <button
                  type="button"
                  disabled={selecting}
                  onClick={() => onSelect(restaurant.id)}
                  className="flex w-full flex-col rounded-xl px-3 py-2.5 text-left transition hover:bg-brand-light disabled:opacity-60"
                >
                  <span className="text-sm font-semibold text-ink">{restaurant.name}</span>
                  <span className="text-xs text-ink-muted">
                    {restaurant.whatsapp}
                    {restaurant.address ? ` · ${restaurant.address}` : ""}
                  </span>
                </button>
              </li>
            ))}
        </ul>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={onClose} disabled={selecting}>
            Cerrar
          </Button>
        </div>
      </Card>
    </div>
  )
}
