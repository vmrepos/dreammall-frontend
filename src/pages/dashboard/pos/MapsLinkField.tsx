import { useState, type ClipboardEvent, type KeyboardEvent } from "react"
import { Button } from "../../../components/atoms/Button"
import { Input } from "../../../components/atoms/Input"
import { Label } from "../../../components/atoms/Label"

type Props = {
  busy: boolean
  error: string
  onApply: (raw: string) => Promise<void>
}

export const MapsLinkField = ({ busy, error, onApply }: Props) => {
  const [value, setValue] = useState("")

  const submit = async (raw: string) => {
    const next = raw.trim()
    if (!next || busy) return
    setValue(next)
    await onApply(next)
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text")
    if (!pasted.trim()) return
    event.preventDefault()
    void submit(pasted)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return
    event.preventDefault()
    void submit(value)
  }

  return (
    <div className="mt-3">
      <Label htmlFor="pos-maps-link">Enlace de Google Maps</Label>
      <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
        <Input
          id="pos-maps-link"
          name="pos-maps-link"
          inputSize="sm"
          placeholder="Pega el enlace copiado de Maps"
          value={value}
          disabled={busy}
          onChange={(event) => setValue(event.target.value)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="button"
          variant="secondary"
          className="shrink-0 px-4 py-2.5 text-sm"
          disabled={busy || !value.trim()}
          onClick={() => void submit(value)}
        >
          {busy ? "Leyendo…" : "Usar enlace"}
        </Button>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-1.5 text-xs text-ink-muted">
          Carga el pin igual que si lo hubieras tocado en el mapa.
        </p>
      )}
    </div>
  )
}
