import { Page as Index } from "./index/Page"
import { Page as Create } from "./new/Page"
import { Page as Show } from "./show/Page"

/** Dashboard Entregas section. Pages stay; set true to mount routes and nav again. */
export const DELIVERIES_SECTION_ENABLED = false

export const Deliveries = { Index, Create, Show }
