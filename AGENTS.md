# Restaurant frontend (SPA)

React + Vite + TypeScript dashboard for **restaurant owners** (Pedi2). Talks to the Rails API under `/api/v1` with cookie-based OAuth (Doorkeeper). This is **not** the driver or customer app.

## Domain (what this app owns)

| Area | Purpose |
|------|---------|
| **Orders** | Manual / POS order create, list, status (creates delivery + spends credit on the API) |
| **Menus / Products** | Active menus and catalog for ordering |
| **Deliveries** | Track delivery status for restaurant orders |
| **Restaurant profile** | Name, address, coords, hours |
| **Subscription** | Plan / credits context in the sidebar |

UI copy is largely **Spanish**. Prefer matching nearby strings.

---

## Layout

```
src/
  pages/
    auth/{login,register,…}/Page.tsx   # public auth screens
    dashboard/<domain>/
      <Domain>.tsx                     # barrel: { Index, Create, Show, … }
      shared/                          # domain presentation (2+ screens)
      index|new|show|form/
        Page.tsx                       # route orchestrator
        LocalWidget.tsx                # page-local presentation (optional)
  components/
    atoms/                             # Button, Input, Card, …
    molecules/                         # FormField, PageHeader, EmptyList, DetailRow, …
    organisms/                         # cross-domain composites only (add when needed)
    auth/                              # ProtectedRoute, PublicRoute
  context/                             # *Context.tsx + providers/*Provider.tsx
  hooks/  services/  types/  utils/
  Routes.tsx
```

Dashboard shell (`Dashboard.tsx`, `Sidebar.tsx`) is layout, not a domain Page.

---

## Page vs Presentation

### Page (`**/Page.tsx`)

- Owns route params, loading, context/hooks wiring, toasts, navigation.
- Composes presentation; does **not** own large JSX trees (tables, dialogs, cards).
- Export `Page` from the file; re-export via the domain barrel (`Orders.Index`, `Menu.Show`, …).

### Presentation (props in, callbacks out)

1. **Global** — `components/atoms|molecules|organisms` — only when used across domains.
2. **Domain `shared/`** — used by 2+ screens in the same domain (e.g. `orders/shared/OrderCard.tsx`).
3. **Page-local** — sibling of that screen’s `Page.tsx` when used by one screen only.

Promote to a higher layer only when a second consumer appears. Do not dump one-off UI into `components/`.

### Barrels

```ts
// pages/dashboard/orders/Orders.tsx
import { Page as Index } from "./index/Page"
import { Page as Create } from "./new/Page"
import { Page as Show } from "./show/Page"

export const Orders = { Index, Create, Show }
```

`Routes.tsx` should import barrels (`Orders.Index`, `Deliveries.Show`), not deep page paths.

---

## Architecture

### Data flow

1. **`services/*`** — Axios calls; map API ↔ app types when shapes differ.
2. **`context/providers/*`** — Shared domain state; call services; expose actions to Pages.
3. **Pages** — Orchestrate: wire hooks/context → pass props/callbacks into presentation.
4. **Hooks** — Reusable behavior (`useForm`, `useCart`). No page-specific “god hook” that only wraps `useForm`.

### HTTP / auth

- Base client: `axiosInstance` in `services/apiClient.ts` (`baseURL` = `VITE_API_URL` + `/api/v1`, `withCredentials: true`).
- Public surface: `apiClient.orders | menus | products | deliveries | restaurants | subscriptions | users`.
- Auth helpers: `services/authService.ts`; session via `AuthProvider`.
- 401 interceptor refreshes once, then dispatches `auth:unauthorized`.
- Rails envelopes: success `{ data, meta? }`, errors `{ error }`. Prefer `response.data.data` in services.

### Forms

- Prefer **`useForm<T>`**: `values`, `handleChange` (needs `name`), `handleSubmit`, `mutate` / `setValues`.
- Cart lines in form state (`items_attributes`); use **`useCart({ items, setItems })`**.
- Derived money is display/submit-only, not form input.
- Special inputs (e.g. `"lat, lng"`) → custom handler + `mutate`.

### UI

- Tailwind v4 + tokens (`brand`, `surface`, `ink`). Reuse atoms/molecules.
- Icons: Font Awesome. Toasts: `sonner`. Formatting: `utils/format.ts`.

### Types

- Prefix with **`T`**: `TOrder`, `TOrderForm`, …
- Map wire-format differences in **services**.

---

## Code style

- TypeScript strict; match nearby files (imports, naming, Spanish copy).
- Prefer small, explicit components over deep abstraction.
- Context split: `FooContext.tsx` + `providers/FooProvider.tsx` + `useFoo`.
- No new state libraries / form libraries / router patterns unless asked.

## Avoid

- Fat Pages that mix large JSX with business logic
- Presentation that fetches or owns domain state
- Duplicating cart/form state outside `useForm`
- Calling Axios from components when a `services/*` module exists
- Hardcoding API base URLs
- English-only UI strings in Spanish flows
- Over-genericizing after one use / dumping into `components/` too early

## Before implementing

1. Mirror a similar Page + `shared/` in the same domain.
2. Extend `types/` when the API shape changes.
3. Wire HTTP in `services/`, then context or Page.
4. Put new UI in page-local → promote to `shared/` → promote to `components/` only as reuse appears.
5. Run `yarn typecheck` / `yarn lint` when touching types or shared hooks.

## Local ops (short)

```bash
cd frontend
yarn install
yarn dev          # Vite
yarn typecheck
yarn lint
```

Env (Vite): `VITE_API_URL`, `VITE_OAUTH_CLIENT_ID` (must match the Rails “Restaurant App” OAuth client). Cookies need API CORS + `CROSS_ORIGIN_COOKIES` aligned with the SPA origin.
