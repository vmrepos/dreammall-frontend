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
  pages/                 # Route screens (auth + dashboard/*)
  components/
    atoms/               # Button, Input, Card, Label, …
    molecules/           # FormField, PageHeader, ConfirmDialog, …
    organisms/           # Larger composites (e.g. OrderItemsTable)
    auth/                # ProtectedRoute, PublicRoute
  context/               # *Context.tsx (shape) + providers/*Provider.tsx
  hooks/                 # Reusable hooks (useForm, useCart, …)
  services/              # HTTP modules + apiClient
  types/                 # T* domain types (mirror API JSON)
  utils/                 # format, coordinates, status helpers
  Routes.tsx             # BrowserRouter + route tree
```

Feature-local UI can live next to the page (e.g. `pages/dashboard/orders/CartItem.tsx`). Prefer that over dumping one-off widgets into `components/` unless reused.

Namespace exports when a feature has several screens:

```ts
// pages/dashboard/orders/Orders.tsx
export const Orders = { Index, Create, Show }
```

---

## Architecture

### Data flow

1. **`services/*`** — Axios calls; map API ↔ app types when shapes differ (e.g. strip UI-only fields, rename `name` → `product_name`).
2. **`context/providers/*`** — Shared domain state (orders list, menus, restaurant, subscription). Call services; expose actions to pages.
3. **Pages** — Compose UI + wire hooks/context. Keep screens readable; extract presentational pieces when JSX gets heavy.
4. **Hooks** — Reusable behavior (`useForm`, `useCart`). Do **not** add a page-specific “god hook” that only wraps `useForm` for one screen.

### HTTP / auth

- Base client: `axiosInstance` in `services/apiClient.ts` (`baseURL` = `VITE_API_URL` + `/api/v1`, `withCredentials: true`).
- Public surface: `apiClient.orders | menus | products | deliveries | restaurants | subscriptions | users`.
- Auth helpers live in `services/authService.ts`; session via `AuthProvider` (`/auth/me`, login/logout/refresh).
- 401 interceptor refreshes once (`/auth/refresh` + `VITE_OAUTH_CLIENT_ID`), then dispatches `auth:unauthorized` (clears session).
- Expect Rails envelopes: success `{ data, meta? }`, errors `{ error }`. Prefer reading `response.data.data` in services.

### Forms

- Prefer **`useForm<T>`** for field state: `values`, `handleChange` (needs `name` on inputs), `handleSubmit`, `mutate` / `setValues` for multi-field updates.
- Cart lines that are part of an order form stay in form state (`items_attributes`); use **`useCart({ items, setItems })`** for add/qty/remove — no second cart store.
- Derived money (subtotal / total) is **not** form input: compute for display and at submit (or eventually on the server).
- Special inputs (e.g. pasted `"lat, lng"`) → custom handler + `mutate`, not clever `handleChange` cases.

### UI

- Tailwind v4 + design tokens (`brand`, `surface`, `ink`, accents). Reuse `components/atoms/*` (`Button`, `Input`, `Card`, …).
- Icons: Font Awesome (`@fortawesome/react-fontawesome`).
- Toasts: `sonner` (`toast.success` / `toast.error`).
- Formatting: `utils/format.ts` (`formatCurrency`, dates, `cn`).

### Types

- Prefix with **`T`**: `TOrder`, `TOrderForm`, `TProduct`, …
- API entity vs write payload: `TOrder` vs `TOrderForm` (form may include UI-only fields like `coordinates`).
- Align field names with the API where practical; map in **services** when the wire format differs.

---

## Code style

- TypeScript strict; match nearby files (imports, naming, Spanish copy).
- Prefer small, explicit components over deep abstraction.
- Context split: `FooContext.tsx` + `providers/FooProvider.tsx` + `useFoo` from the context module.
- No new state libraries / form libraries / router patterns unless asked.
- Don’t invent parallel API clients or auth schemes.

## Avoid

- Duplicating cart/form state outside `useForm` when the form already owns it
- Fat page files that mix large JSX trees with lots of business logic — extract UI pieces or a small reusable hook, not a one-off “useThisPage” wrapper
- Calling Axios directly from components when a `services/*` module exists
- Hardcoding API base URLs (use env + `apiClient`)
- English-only new UI strings in flows that are already Spanish
- Over-genericizing after one use

## Before implementing

1. Find a similar page/service/context and mirror it.
2. Add or extend `types/` when the API shape changes.
3. Wire HTTP in `services/`, then context or page.
4. Keep changes localized to the feature folder when possible.
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
