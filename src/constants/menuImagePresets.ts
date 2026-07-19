export const MENU_IMAGE_PRESETS = [
  { id: "food", label: "Comida", src: "/menu-presets/food.webp" },
  { id: "beverages", label: "Bebidas", src: "/menu-presets/beverages.webp" },
  { id: "dessert", label: "Postres", src: "/menu-presets/dessert.webp" },
  { id: "combos", label: "Combos", src: "/menu-presets/combos.webp" },
  { id: "todays-promo", label: "Promo del día", src: "/menu-presets/todays-promo.webp" },
  { id: "miscellaneous", label: "Varios", src: "/menu-presets/miscellaneous.webp" },
] as const

export type MenuImagePresetId = (typeof MENU_IMAGE_PRESETS)[number]["id"]
