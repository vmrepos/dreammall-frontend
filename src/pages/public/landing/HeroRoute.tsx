import mark from "../../../assets/logo-pedi2.png"

export const HeroRoute = () => (
  <div className="relative mx-auto aspect-square w-full max-w-[22rem] md:max-w-none">
    <img
      src={mark}
      alt=""
      className="pointer-events-none absolute left-1/2 top-1/2 w-[58%] -translate-x-1/2 -translate-y-[46%] opacity-[0.14]"
    />
    <div
      className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_center,rgba(31,154,86,0.35),transparent_68%)]"
      aria-hidden
    />
    <svg viewBox="0 0 320 320" className="relative h-full w-full" aria-hidden>
      <circle cx="160" cy="160" r="118" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx="160" cy="160" r="78" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <path
        d="M78 214 C 118 168, 132 128, 168 112 S 248 108, 246 168"
        fill="none"
        stroke="#d4a017"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="7 8"
        opacity="0.9"
      />
      <g transform="translate(64 198)">
        <rect width="44" height="36" rx="8" fill="#124033" stroke="rgba(255,255,255,0.2)" />
        <rect x="10" y="14" width="24" height="10" rx="2" fill="#0c6b3d" />
        <rect x="16" y="6" width="12" height="8" rx="1" fill="#e7f3ec" />
      </g>
      <g transform="translate(228 148)">
        <path d="M18 0 C8 0 0 8 0 18 C0 32 18 48 18 48 S36 32 36 18 C36 8 28 0 18 0Z" fill="#c0392b" />
        <circle cx="18" cy="18" r="6" fill="#e8eee9" />
      </g>
      <g transform="translate(148 118)">
        <circle cx="18" cy="18" r="16" fill="#0c6b3d" />
        <path
          d="M10 20 l8 0 l3-8 l4 16 l3-8 l6 0"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
    <div className="absolute right-2 top-6 w-[11.5rem] rounded-2xl border border-white/15 bg-white/10 p-3 text-left shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-md md:right-0 md:top-10">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-accent-sun">En camino</p>
      <p className="mt-1 text-sm font-semibold text-white">Pedido listo para recoger</p>
      <p className="mt-1 text-xs text-white/65">Repartidor asignado · pin en el mapa</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
        <div className="h-full w-2/3 rounded-full bg-accent-sun" />
      </div>
    </div>
  </div>
)
