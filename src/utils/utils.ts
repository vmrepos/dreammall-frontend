import type { TMenu } from "../types/Menu"
import type { TProduct } from "../types/Product"

export function ProductList(menus: TMenu[]): TProduct[] {
  return menus.filter((menu) => menu.active)
    .flatMap((menu) =>
      menu.products
        ?.filter((product) => product.active)
        .map((product) => ({ ...product, menuName: menu.name })) ?? [],
    )
}

export function revokePreviewIfBlob(preview: string | null) {
  if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview)
}