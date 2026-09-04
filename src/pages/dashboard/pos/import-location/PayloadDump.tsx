import { Button } from "../../../../components/atoms/Button"
import { Card } from "../../../../components/atoms/Card"
import type { TShareTargetPayload } from "../../../../utils/shareTarget"

type Props = {
  live: TShareTargetPayload | null
  stored: TShareTargetPayload | null
  onCopy: () => void
}

const empty = "(vacío)"

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
    <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all rounded-xl bg-gray-50 px-3 py-2.5 font-mono text-[13px] leading-relaxed text-ink">
      {value || empty}
    </pre>
  </div>
)

const Dump = ({ payload }: { payload: TShareTargetPayload }) => (
  <div className="flex flex-col gap-4">
    <Field label="title" value={payload.title} />
    <Field label="text" value={payload.text} />
    <Field label="url" value={payload.url} />
    <Field label="query completa" value={payload.search || empty} />
    <Field label="todos los params" value={JSON.stringify(payload.params, null, 2)} />
    <Field label="href" value={payload.href} />
    <Field label="referrer" value={payload.referrer} />
    <Field label="recibido" value={payload.receivedAt} />
    <Field label="userAgent" value={payload.userAgent} />
  </div>
)

export const PayloadDump = ({ live, stored, onCopy }: Props) => {
  const shown = live ?? stored

  return (
    <Card padding="md">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">Payload de share_target</p>
          <p className="mt-1 text-sm text-ink-muted">
            {live
              ? "Leído de la URL actual."
              : stored
                ? "La URL ya no tiene params. Esto es lo último guardado al abrir Pedí2 desde Compartir."
                : "Todavía no llegó nada."}
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={onCopy} disabled={!shown}>
          Copiar JSON
        </Button>
      </div>
      {shown ? (
        <Dump payload={shown} />
      ) : (
        <p className="text-sm text-ink-muted">
            Comparte una ubicación de Maps a Pedí2, o abre{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-[13px]">
            /pos/import-location?title=…&text=…&url=…
          </code>{" "}
          para simularlo.
        </p>
      )}
    </Card>
  )
}
