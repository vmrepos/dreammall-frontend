import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQrcode } from "@fortawesome/free-solid-svg-icons"
import { Card } from "../../../../components/atoms/Card"
import { resolveMediaUrl } from "../../../../utils/mediaUrl"

type Props = {
  restaurantName?: string
  qrUrl?: string | null
}

export const PaymentQr = ({ restaurantName, qrUrl }: Props) => {
  const imageSrc = resolveMediaUrl(qrUrl)

  return (
    <Card padding="lg">
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-light text-brand">
          <FontAwesomeIcon icon={faQrcode} className="size-6" aria-hidden />
        </span>
        <h2 className="mt-3 text-base font-semibold text-ink">Paga tu pedido</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          {restaurantName
            ? `Transfiere con el QR de ${restaurantName}. Cuando confirmen el pago, empezarán a preparar tu pedido.`
            : "Transfiere con el QR del restaurante. Cuando confirmen el pago, empezarán a preparar tu pedido."}
        </p>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Código QR de pago"
            className="mt-4 w-full max-w-[14rem] rounded-2xl border border-gray-200 bg-white object-contain p-3"
          />
        ) : (
          <div className="mt-4 flex aspect-square w-full max-w-[14rem] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 text-sm text-ink-muted">
            El restaurante aún no cargó un código QR. Te indicará cómo pagar.
          </div>
        )}
      </div>
    </Card>
  )
}
