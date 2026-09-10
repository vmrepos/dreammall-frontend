import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPrint } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Button } from "../../../../components/atoms/Button"
import { useAuth } from "../../../../context/AuthContext"
import type { TOrder } from "../../../../types/Order"
import { cn } from "../../../../utils/format"
import {
  kitchenPrintErrorMessage,
  printerConfigFromRestaurant,
  printOrderTicket,
} from "../../../../utils/orderTicket"

type Props = {
  order: TOrder
  compact?: boolean
}

export const PrintTicketButton = ({ order, compact = false }: Props) => {
  const { restaurant } = useAuth()
  const config = printerConfigFromRestaurant(restaurant)
  const [busy, setBusy] = useState(false)

  if (!config) return null

  const handlePrint = async () => {
    setBusy(true)
    try {
      await printOrderTicket(order, config)
      toast.success(`Ticket del pedido #${order.id} enviado`)
    } catch (error) {
      toast.warning(kitchenPrintErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      className={cn(
        "shrink-0",
        compact ? "rounded-lg px-3 py-2 text-xs" : "rounded-lg px-2.5 py-1.5 text-xs",
      )}
      disabled={busy}
      onClick={() => void handlePrint()}
    >
      <FontAwesomeIcon icon={faPrint} className="size-3.5" aria-hidden />
      {busy ? "Imprimiendo" : "Reimprimir"}
    </Button>
  )
}
