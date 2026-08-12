import type { TProduct, TProductOptionGroupWrite } from "../../../../../types/Product"

export type TProductOptionForm = {
  clientKey: string
  id?: number
  name: string
  price_modifier: string
  default: boolean
  active: boolean
  _destroy?: boolean
}

export type TProductOptionGroupForm = {
  clientKey: string
  id?: number
  name: string
  required: boolean
  multiple: boolean
  min_select: number
  max_select: number | null
  _destroy?: boolean
  product_options: TProductOptionForm[]
}

export const emptyOption = (): TProductOptionForm => ({
  clientKey: crypto.randomUUID(),
  name: "",
  price_modifier: "0.00",
  default: false,
  active: true,
})

export const emptyGroup = (): TProductOptionGroupForm => ({
  clientKey: crypto.randomUUID(),
  name: "",
  required: false,
  multiple: false,
  min_select: 0,
  max_select: null,
  product_options: [emptyOption()],
})

export const groupsFromProduct = (product: TProduct | null): TProductOptionGroupForm[] =>
  (product?.product_option_groups ?? []).map((group) => ({
    clientKey: String(group.id),
    id: group.id,
    name: group.name,
    required: group.required,
    multiple: Boolean(group.multiple),
    min_select: group.min_select ?? (group.required ? 1 : 0),
    max_select: group.max_select ?? null,
    product_options: (group.product_options ?? []).map((option) => ({
      clientKey: String(option.id),
      id: option.id,
      name: option.name,
      price_modifier: String(option.price_modifier ?? "0.00"),
      default: Boolean(option.default),
      active: option.active !== false,
    })),
  }))

export const toGroupsAttributes = (
  groups: TProductOptionGroupForm[],
): TProductOptionGroupWrite[] =>
  groups.flatMap((group, groupIndex) => {
    const isBlankNew =
      !group.id &&
      !group.name.trim() &&
      !group.product_options.some((option) => option.id || option.name.trim())

    if (isBlankNew) return []

    return [
      {
        ...(group.id ? { id: group.id } : {}),
        name: group.name.trim(),
        required: group.required,
        multiple: group.multiple,
        min_select: group.multiple ? group.min_select : group.required ? 1 : 0,
        max_select: group.multiple ? group.max_select : 1,
        position: groupIndex,
        ...(group._destroy ? { _destroy: true } : {}),
        product_options_attributes: group.product_options.flatMap((option, optionIndex) => {
          if (!option.id && !option.name.trim()) return []

          return [
            {
              ...(option.id ? { id: option.id } : {}),
              name: option.name.trim(),
              price_modifier: option.price_modifier.trim() || "0.00",
              position: optionIndex,
              default: option.default,
              active: option.active,
              ...(option._destroy ? { _destroy: true } : {}),
            },
          ]
        }),
      },
    ]
  })
