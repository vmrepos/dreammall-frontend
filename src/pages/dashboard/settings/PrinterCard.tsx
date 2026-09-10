import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPrint } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Label } from "../../../components/atoms/Label"
import { Toggle } from "../../../components/atoms/Toggle"
import { FormField } from "../../../components/molecules/FormField"
import { DEFAULT_PRINTER_URL } from "../../../services/cleanter"
import type { TTicketWidth } from "../../../types/Restaurant"

type Props = {
  usesPrinter: boolean
  printerUrl: string
  ticketWidth: TTicketWidth
  onChange: (patch: {
    uses_printer?: boolean
    printer_url?: string
    ticket_width?: TTicketWidth
  }) => void
}

const WIDTHS: TTicketWidth[] = [58, 80]

export const PrinterCard = ({ usesPrinter, printerUrl, ticketWidth, onChange }: Props) => {
  const handleToggle = (enabled: boolean) => {
    onChange({
      uses_printer: enabled,
      printer_url: enabled && !printerUrl.trim() ? DEFAULT_PRINTER_URL : printerUrl,
    })
  }

  return (
    <section className="border-t border-gray-100 pt-6">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand">
        <FontAwesomeIcon icon={faPrint} className="size-4" aria-hidden />
        Impresora de tickets
      </h2>
      <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-100 px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">Usar impresora</p>
          <p className="mt-0.5 text-xs text-gray-500">
            Al pasar a Preparando se imprime el ticket. También aparece Reimprimir en el pedido.
          </p>
        </div>
        <Toggle
          checked={usesPrinter}
          label={usesPrinter ? "Desactivar impresora" : "Activar impresora"}
          onChange={handleToggle}
        />
      </div>

      {usesPrinter ? (
        <div className="mt-4 grid gap-4">
          <div>
            <FormField
              id="printer_url"
              label="URL de Cleanter"
              type="url"
              placeholder={DEFAULT_PRINTER_URL}
              value={printerUrl}
              onChange={(ev) => onChange({ printer_url: ev.target.value })}
            />
            <p className="mt-2 text-xs text-gray-500">
              Dirección del puente en este dispositivo, por ejemplo {DEFAULT_PRINTER_URL}.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-left">
            <Label id="ticket_width">Ancho del papel</Label>
            <div className="flex gap-2" role="group" aria-labelledby="ticket_width">
              {WIDTHS.map((width) => (
                <Button
                  key={width}
                  type="button"
                  variant={ticketWidth === width ? "primary" : "secondary"}
                  className="px-4 py-2.5"
                  aria-pressed={ticketWidth === width}
                  onClick={() => onChange({ ticket_width: width })}
                >
                  {width} mm
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
