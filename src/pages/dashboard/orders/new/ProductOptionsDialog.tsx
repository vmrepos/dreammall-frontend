import { useMemo, useState } from "react"
import { Button } from "../../../../components/atoms/Button"
import { Card } from "../../../../components/atoms/Card"
import type { TOrderItemOption } from "../../../../types/OrderItem"
import type { TProduct, TProductOption, TProductOptionGroup } from "../../../../types/Product"
import { cn, formatCurrency } from "../../../../utils/format"
import { groupMaxSelect, groupMinSelect, groupSelectionHint } from "../../../../utils/productOptions"

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
    if (group.multiple) {
      const defaults = options.filter((option) => option.default).map((option) => option.id)
      const max = groupMaxSelect(group)
      selected[group.id] = max != null ? defaults.slice(0, max) : defaults
      continue
    }

    const fallback = options.find((option) => option.default) ?? (group.required ? options[0] : undefined)
    selected[group.id] = fallback ? [fallback.id] : []
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
  const invalidSelection = groups.some((group) => {
    const count = (selected[group.id] ?? []).length
    const min = groupMinSelect(group)
    const max = groupMaxSelect(group)
    return count < min || (max != null && count > max)
  })

  const selectSingle = (group: TProductOptionGroup, optionId: number) => {
    setSelected((current) => {
      const currentIds = current[group.id] ?? []
      if (!group.required && currentIds.includes(optionId)) {
        return { ...current, [group.id]: [] }
      }
      return { ...current, [group.id]: [optionId] }
    })
  }

  const toggleMultiple = (group: TProductOptionGroup, option: TProductOption) => {
    setSelected((current) => {
      const currentIds = current[group.id] ?? []
      if (currentIds.includes(option.id)) {
        return { ...current, [group.id]: currentIds.filter((id) => id !== option.id) }
      }
      const max = groupMaxSelect(group)
      if (max != null && currentIds.length >= max) return current
      return { ...current, [group.id]: [...currentIds, option.id] }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <Card padding="lg" className="w-full max-w-xl">
        <h2 className="text-lg font-bold text-gray-900">Personalizar {product.name}</h2>
        <p className="mt-1 text-sm text-gray-500">Elige las opciones de este producto.</p>

        <div className="mt-5 grid max-h-[min(24rem,50svh)] gap-4 overflow-y-auto">
          {groups.map((group) => {
            const options = activeOptions(group)
            const selectedIds = selected[group.id] ?? []
            const max = groupMaxSelect(group)
            const atMax = max != null && selectedIds.length >= max

            return (
              <fieldset key={group.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <legend className="px-1 text-sm font-semibold text-gray-900">
                  {group.name}
                  <span className="ml-1 text-xs font-medium text-gray-500">
                    {groupSelectionHint(group)}
                  </span>
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {options.map((option) => {
                    const checked = selectedIds.includes(option.id)
                    const disabled = group.multiple && atMax && !checked
                    const inputId = `option-${group.id}-${option.id}`

                    return (
                      <label
                        key={option.id}
                        htmlFor={inputId}
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition",
                          checked
                            ? "border-brand bg-brand-light text-brand"
                            : disabled
                              ? "cursor-not-allowed border-gray-100 bg-gray-100 text-gray-400"
                              : "border-gray-200 bg-surface-elevated text-gray-900 hover:border-gray-300",
                        )}
                      >
                        <input
                          id={inputId}
                          type={group.multiple ? "checkbox" : "radio"}
                          name={`group-${group.id}`}
                          checked={checked}
                          disabled={disabled}
                          className="sr-only"
                          onChange={() =>
                            group.multiple
                              ? toggleMultiple(group, option)
                              : selectSingle(group, option.id)
                          }
                        />
                        {option.name}
                        {Number(option.price_modifier) > 0 && (
                          <span className={cn("text-xs tabular-nums", checked ? "text-brand" : "text-gray-500")}>
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
              disabled={invalidSelection}
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
