import { useMemo, useState } from "react"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import type { TOrderItemOption } from "../../../types/OrderItem"
import type { TProduct, TProductOption, TProductOptionGroup } from "../../../types/Product"
import { formatCurrency } from "../../../utils/format"

type Props = {
  product: TProduct
  onConfirm: (options: TOrderItemOption[]) => void
  onCancel: () => void
}

const activeOptions = (group: TProductOptionGroup) =>
  (group.product_options ?? []).filter((option) => option.active !== false)

const initialSelection = (product: TProduct) => {
  const selected: Record<number, number[]> = {}

  for (const group of product.product_option_groups ?? []) {
    const options = activeOptions(group)
    if (group.required) {
      const fallback = options.find((option) => option.default) ?? options[0]
      selected[group.id] = fallback ? [fallback.id] : []
    } else {
      selected[group.id] = options.filter((option) => option.default).map((option) => option.id)
    }
  }

  return selected
}

const toSnapshots = (
  product: TProduct,
  selected: Record<number, number[]>,
): TOrderItemOption[] =>
  (product.product_option_groups ?? []).flatMap((group) => {
    const optionIds = new Set(selected[group.id] ?? [])
    return activeOptions(group)
      .filter((option) => optionIds.has(option.id))
      .map((option) => ({
        option_group_name: group.name,
        option_name: option.name,
        price_modifier: String(option.price_modifier ?? "0.00"),
      }))
  })

export const ProductOptionsDialog = ({ product, onConfirm, onCancel }: Props) => {
  const [selected, setSelected] = useState(() => initialSelection(product))
  const groups = (product.product_option_groups ?? []).filter(
    (group) => activeOptions(group).length > 0,
  )

  const snapshots = useMemo(() => toSnapshots(product, selected), [product, selected])
  const previewPrice = (
    Number(product.price) + snapshots.reduce((sum, option) => sum + Number(option.price_modifier), 0)
  ).toFixed(2)
  const missingRequired = groups.some(
    (group) => group.required && (selected[group.id] ?? []).length === 0,
  )

  const selectRequired = (groupId: number, optionId: number) => {
    setSelected((current) => ({ ...current, [groupId]: [optionId] }))
  }

  const toggleOptional = (groupId: number, option: TProductOption) => {
    setSelected((current) => {
      const currentIds = current[groupId] ?? []
      const nextIds = currentIds.includes(option.id)
        ? currentIds.filter((id) => id !== option.id)
        : [...currentIds, option.id]
      return { ...current, [groupId]: nextIds }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <Card padding="lg" className="w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-900">Personalizar {product.name}</h2>
        <p className="mt-1 text-sm text-gray-500">Elige las opciones de este producto.</p>

        <div className="mt-5 grid max-h-[min(24rem,50svh)] gap-4 overflow-y-auto">
          {groups.map((group) => {
            const options = activeOptions(group)
            const selectedIds = selected[group.id] ?? []

            return (
              <fieldset key={group.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <legend className="px-1 text-sm font-semibold text-gray-900">
                  {group.name}
                  {group.required && <span className="ml-1 text-xs font-medium text-gray-500">Obligatorio</span>}
                </legend>
                <div className="mt-2 grid gap-2">
                  {options.map((option) => {
                    const checked = selectedIds.includes(option.id)
                    const inputId = `option-${group.id}-${option.id}`

                    return (
                      <label
                        key={option.id}
                        htmlFor={inputId}
                        className="flex cursor-pointer items-center justify-between gap-3 rounded-lg bg-surface-elevated px-3 py-2 text-sm"
                      >
                        <span className="flex items-center gap-2 text-gray-900">
                          <input
                            id={inputId}
                            type={group.required ? "radio" : "checkbox"}
                            name={`group-${group.id}`}
                            checked={checked}
                            onChange={() =>
                              group.required
                                ? selectRequired(group.id, option.id)
                                : toggleOptional(group.id, option)
                            }
                          />
                          {option.name}
                        </span>
                        {Number(option.price_modifier) > 0 && (
                          <span className="text-xs tabular-nums text-gray-500">
                            +{formatCurrency(option.price_modifier)}
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            )
          })}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <p className="text-sm font-semibold tabular-nums text-gray-900">
            {formatCurrency(previewPrice)}
          </p>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Volver
            </Button>
            <Button
              type="button"
              disabled={missingRequired}
              onClick={() => onConfirm(toSnapshots(product, selected))}
            >
              Agregar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
