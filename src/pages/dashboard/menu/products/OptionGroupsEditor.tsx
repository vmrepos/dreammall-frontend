import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../components/atoms/Button"
import { Input } from "../../../../components/atoms/Input"
import { Label } from "../../../../components/atoms/Label"
import { Toggle } from "../../../../components/atoms/Toggle"
import {
  emptyGroup,
  emptyOption,
  type TProductOptionForm,
  type TProductOptionGroupForm,
} from "./optionGroups"

type Props = {
  groups: TProductOptionGroupForm[]
  onChange: (groups: TProductOptionGroupForm[]) => void
}

export const OptionGroupsEditor = ({ groups, onChange }: Props) => {
  const visibleGroups = groups.filter((group) => !group._destroy)

  const updateGroup = (clientKey: string, patch: Partial<TProductOptionGroupForm>) => {
    onChange(groups.map((group) => (group.clientKey === clientKey ? { ...group, ...patch } : group)))
  }

  const removeGroup = (clientKey: string) => {
    onChange(
      groups.flatMap((group) => {
        if (group.clientKey !== clientKey) return [group]
        if (group.id) return [{ ...group, _destroy: true }]
        return []
      }),
    )
  }

  const updateOption = (
    groupKey: string,
    optionKey: string,
    patch: Partial<TProductOptionForm>,
  ) => {
    onChange(
      groups.map((group) => {
        if (group.clientKey !== groupKey) return group
        return {
          ...group,
          product_options: group.product_options.map((option) =>
            option.clientKey === optionKey ? { ...option, ...patch } : option,
          ),
        }
      }),
    )
  }

  const removeOption = (groupKey: string, optionKey: string) => {
    onChange(
      groups.map((group) => {
        if (group.clientKey !== groupKey) return group
        return {
          ...group,
          product_options: group.product_options.flatMap((option) => {
            if (option.clientKey !== optionKey) return [option]
            if (option.id) return [{ ...option, _destroy: true }]
            return []
          }),
        }
      }),
    )
  }

  const addOption = (groupKey: string) => {
    onChange(
      groups.map((group) =>
        group.clientKey === groupKey
          ? { ...group, product_options: [...group.product_options, emptyOption()] }
          : group,
      ),
    )
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Personalización</h2>
          <p className="mt-1 text-xs text-gray-500">
            Grupos como tamaño o extras, con opciones y recargo.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="shrink-0 gap-1 rounded-lg px-3 py-2 text-xs"
          onClick={() => onChange([...groups, emptyGroup()])}
        >
          <FontAwesomeIcon icon={faPlus} className="size-3" aria-hidden />
          Agregar grupo
        </Button>
      </div>

      {visibleGroups.length === 0 ? (
        <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
          Este producto no tiene opciones todavía.
        </p>
      ) : (
        <div className="grid gap-4">
          {visibleGroups.map((group, groupIndex) => {
            const visibleOptions = group.product_options.filter((option) => !option._destroy)

            return (
              <div
                key={group.clientKey}
                className="rounded-xl border border-gray-200 bg-gray-50/70 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Grupo {groupIndex + 1}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => removeGroup(group.clientKey)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="size-3" aria-hidden />
                    Quitar
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <div>
                    <Label htmlFor={`group-name-${group.clientKey}`}>Nombre del grupo</Label>
                    <Input
                      id={`group-name-${group.clientKey}`}
                      className="mt-1.5"
                      value={group.name}
                      onChange={(ev) => updateGroup(group.clientKey, { name: ev.target.value })}
                      placeholder="Ej. Tamaño"
                      required
                    />
                  </div>
                  <div className="flex items-end justify-between gap-3 rounded-xl bg-surface-elevated px-3 py-2 sm:min-w-40">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Obligatorio</p>
                      <p className="text-xs text-gray-500">El cliente debe elegir una</p>
                    </div>
                    <Toggle
                      checked={group.required}
                      label={`Grupo ${group.name || groupIndex + 1} obligatorio`}
                      onChange={(required) => updateGroup(group.clientKey, { required })}
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  <div className="hidden grid-cols-[1fr_7rem_auto_auto_auto] gap-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:grid">
                    <span>Opción</span>
                    <span>Recargo</span>
                    <span>Default</span>
                    <span>Activa</span>
                    <span />
                  </div>

                  {visibleOptions.map((option) => (
                    <div
                      key={option.clientKey}
                      className="grid gap-2 rounded-lg bg-surface-elevated p-2 sm:grid-cols-[1fr_7rem_auto_auto_auto] sm:items-center"
                    >
                      <Input
                        value={option.name}
                        onChange={(ev) =>
                          updateOption(group.clientKey, option.clientKey, { name: ev.target.value })
                        }
                        placeholder="Ej. Grande"
                        required
                      />
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={option.price_modifier}
                        onChange={(ev) =>
                          updateOption(group.clientKey, option.clientKey, {
                            price_modifier: ev.target.value,
                          })
                        }
                        aria-label={`Recargo de ${option.name || "opción"}`}
                      />
                      <div className="flex items-center justify-between gap-2 sm:justify-center">
                        <span className="text-xs text-gray-500 sm:hidden">Default</span>
                        <Toggle
                          checked={option.default}
                          label={`Opción ${option.name || "sin nombre"} por defecto`}
                          onChange={(isDefault) =>
                            updateOption(group.clientKey, option.clientKey, { default: isDefault })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 sm:justify-center">
                        <span className="text-xs text-gray-500 sm:hidden">Activa</span>
                        <Toggle
                          checked={option.active}
                          label={`Opción ${option.name || "sin nombre"} activa`}
                          onChange={(active) =>
                            updateOption(group.clientKey, option.clientKey, { active })
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="justify-self-end px-2 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => removeOption(group.clientKey, option.clientKey)}
                        aria-label="Quitar opción"
                      >
                        <FontAwesomeIcon icon={faTrash} className="size-3.5" aria-hidden />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-1 w-fit gap-1 rounded-lg px-3 py-1.5 text-xs"
                    onClick={() => addOption(group.clientKey)}
                  >
                    <FontAwesomeIcon icon={faPlus} className="size-3" aria-hidden />
                    Agregar opción
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
